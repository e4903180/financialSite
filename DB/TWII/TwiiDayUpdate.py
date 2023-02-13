import yfinance as yf
import MySQLdb
import MySQLdb.cursors
import datetime
import sys
import pandas as pd
import json

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

class TWII():
    def __init__(self) -> None:
        self._TWII_table_data = None
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self.start_date = datetime.date.today() - datetime.timedelta(days = 30)

    def update(self) -> None:
        """Update data

            Args:
                None
            Return:
                None
        """

        self._update_TWII(self.start_date)

    def _update_TWII(self, start_date : str):
        """Update TWII

            Args:
                start_date : (str) data start date
            Return:
                None
        """
        self._TWII_table_data = yf.download("^TWII", start = start_date, progress = False, show_errors = False)

        self._TWII_table_data = self._TWII_table_data.reset_index()
        self._TWII_table_data = self._TWII_table_data.fillna(0)

        for i in range(len(self._TWII_table_data)):
            if not self._isDuplicate(self._TWII_table_data.iloc[i]["Date"].strftime("%Y-%m-%d")):
                self._update_to_sql(self._TWII_table_data.iloc[i]["Date"].strftime("%Y-%m-%d"), self._TWII_table_data.iloc[i]["Close"].round(2))

    def _update_to_sql(self, date : str, close : float) -> None:
        """Update data to DB

            Args:
                date : (str) newest date
                data : (float) newest data
            Return:
                None
        """
        sql = f'INSERT INTO TWII (`date`, `Close`) VALUES ("{date}", "{close}")'

        self._cursor.execute(sql)
        self._db.commit()

    def _isDuplicate(self, date : str) -> bool:
        """Check if data is duplicate

            Args:
                date : (str) data date
                table : (str) table name
            Return:
                bool
        """
        sql = f'SELECT * FROM TWII WHERE date="{date}"'

        self._cursor.execute(sql)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if len(result) == 0:
            return False

        return True


if __name__ == "__main__":
    twii = TWII()

    sys.stderr = open("/home/cosbi/桌面/financialData/TWII/" + str(datetime.date.today()) + '.log', 'w')
    twii.update()