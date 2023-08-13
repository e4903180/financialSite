import datetime
import sys
import MySQLdb
import MySQLdb.cursors
import yfinance as yf
import pandas as pd
import json

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from service.LogNotifyService.logNotifyService import LogNotifyService

class DxyJnkUpdate():
    """Update yfinance data, include
        1. DXY => US Dollar/USDX - Index - Cash
        2. JNK => SPDR Bloomberg High Yield Bond ETF
    """

    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def update(self) -> None:
        """Update data

            Args:
                None
            Return:
                None
        """
        month_data_name = {
            "JNK" : "JNK",
            "DXY" : "DX-Y.NYB"
        }

        start_date = datetime.date.today() - datetime.timedelta(days = 10)

        for name in month_data_name:
            data = yf.download(month_data_name[name], start = start_date, progress = False, show_errors = False)
            data = data.reset_index()
            data = data.fillna(0.0)

            for i in range(len(data)):
                if not self._isDuplicate(data.iloc[i]["Date"].strftime("%Y-%m-%d"), name):
                    self._insert(data.iloc[i]["Date"].strftime("%Y-%m-%d"), data.iloc[i]["Close"].round(2), name)

    def _insert(self, date : str, data : float, table : str) -> None:
        """Update data to DB

            Args:
                date : (str) newest date
                data : (float) newest data
                table : (str) table name
            Return:
                None
        """
        query = f'INSERT INTO {table} (`date`, `Close`) VALUES (%s, %s)'
        param = (date, data)

        self._cursor.execute(query, param)
        self._db.commit()
    
    def _isDuplicate(self, date : str, table : str) -> bool:
        """Check if data is duplicate

            Args:
                date : (str) data date
                table : (str) table name
            Return:
                bool
        """
        query = f'SELECT * FROM {table} WHERE date=%s'
        param = (date,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return False if len(result) == 0 else True

if __name__ == "__main__":
    log_path = f"{root_path['FRED_DAY_UPDATE_LOG_PATH']}/{str(datetime.date.today())}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    dxy_jnk_update = DxyJnkUpdate()

    try:
        dxy_jnk_update.update()
    except Exception as e:
        log_notify_service.send_email("Fred日更新狀態", str(e))