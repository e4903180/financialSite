import datetime
import sys
import MySQLdb
import MySQLdb.cursors
import yfinance as yf
import pandas as pd
import json

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService

class DxyJnkUpdate():
    """Update yfinance data, include
        1. DXY => US Dollar/USDX - Index - Cash
        2. JNK => SPDR Bloomberg High Yield Bond ETF
    """

    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self.JNK_table_data = None
        self.DXY_table_data = None
        self.start_date = datetime.date.today() - datetime.timedelta(days = 10)

    def _update_JNK(self, start_date : str) -> None:
        """Update JNK

            Args:
                start_date : (str) data start date
            Return:
                None
        """
        self.JNK_table_data = yf.download("JNK", start = start_date, progress = False, show_errors = False)
        
        self.JNK_table_data = self.JNK_table_data.reset_index()
        self.JNK_table_data = self.JNK_table_data.fillna(0.0)

        for i in range(len(self.JNK_table_data)):
            if not self._isDuplicate(self.JNK_table_data.iloc[i]["Date"].strftime("%Y-%m-%d"), "JNK"):
                self._update_to_sql(self.JNK_table_data.iloc[i]["Date"].strftime("%Y-%m-%d"), self.JNK_table_data.iloc[i]["Close"].round(2), "JNK")
    
    def _update_DXY(self, start_date : str) -> None:
        """Update DXY

            Args:
                start_date : (str) data start date
            Return:
                None
        """
        self.DXY_table_data = yf.download("DX-Y.NYB", start = start_date, progress = False, show_errors = False)
        self.DXY_table_data = self.DXY_table_data.reset_index()
        self.DXY_table_data = self.DXY_table_data.fillna(0.0)

        for i in range(len(self.DXY_table_data)):
            if not self._isDuplicate(self.DXY_table_data.iloc[i]["Date"].strftime("%Y-%m-%d"), "DXY"):
                self._update_to_sql(self.DXY_table_data.iloc[i]["Date"].strftime("%Y-%m-%d"), self.DXY_table_data.iloc[i]["Close"].round(2), "DXY")

    def update(self) -> None:
        """Update data

            Args:
                None
            Return:
                None
        """
        self._update_JNK(self.start_date)
        self._update_DXY(self.start_date)

    def _update_to_sql(self, date : str, data : float, table : str) -> None:
        """Update data to DB

            Args:
                date : (str) newest date
                data : (float) newest data
                table : (str) table name
            Return:
                None
        """
        sql = f'INSERT INTO {table} (`date`, `Close`) VALUES ("{date}", "{data}")'

        self._cursor.execute(sql)
        self._db.commit()
    
    def _isDuplicate(self, date : str, table : str) -> bool:
        """Check if data is duplicate

            Args:
                date : (str) data date
                table : (str) table name
            Return:
                bool
        """
        sql = f'SELECT * FROM {table} WHERE date="{date}"'

        self._cursor.execute(sql)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if len(result) == 0:
            return False

        return True

if __name__ == "__main__":
    log_path = f"{root_path['FRED_DAY_UPDATE_LOG_PATH']}/{str(datetime.date.today())}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    DJU = DxyJnkUpdate()

    try:
        DJU.update()
    except Exception as e:
        print(str(e), file = sys.stderr)
        log_notify_service.send_email("Fred日更新狀態", log_path)