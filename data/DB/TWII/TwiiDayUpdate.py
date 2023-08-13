import yfinance as yf
import MySQLdb
import MySQLdb.cursors
import datetime
import sys
import pandas as pd
import json

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from service.LogNotifyService.logNotifyService import LogNotifyService

class TwiiUpdate():
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
        start_date = datetime.date.today() - datetime.timedelta(days = 10)

        data = yf.download("^TWII", start = start_date, progress = False, show_errors = False)

        data = data.reset_index()
        data = data.fillna(0)

        for i in range(len(data)):
            if not self._isDuplicate(data.iloc[i]["Date"].strftime("%Y-%m-%d")):
                self._insert(data.iloc[i]["Date"].strftime("%Y-%m-%d"), data.iloc[i]["Close"].round(2))

    def _insert(self, date : str, close : float) -> None:
        """Update data to DB

            Args:
                date : (str) newest date
                data : (float) newest data
            Return:
                None
        """
        query = 'INSERT INTO TWII (`date`, `Close`) VALUES (%s, %s)'
        param = (date, close)

        self._cursor.execute(query, param)
        self._db.commit()

    def _isDuplicate(self, date : str) -> bool:
        """Check if data is duplicate

            Args:
                date : (str) data date
                table : (str) table name
            Return:
                bool
        """
        query = 'SELECT * FROM TWII WHERE date=%s'
        param = (date,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return False if len(result) == 0 else True

if __name__ == "__main__":
    log_path = f"{root_path['TWII_LOG_PATH']}/{str(datetime.date.today())}.log"
    
    log_notify_service = LogNotifyService()
    twii_update = TwiiUpdate()

    sys.stderr = open(log_path, 'w')

    try:
        twii_update.update()
    except Exception as e:
        log_notify_service.send_email("加權指數更新狀態", str(e))