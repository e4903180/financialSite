import yfinance as yf
import MySQLdb
import MySQLdb.cursors
import datetime
import sys
import pandas as pd

class TWII():
    def __init__(self) -> None:
        self._TWII_table_data = None
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self.today = datetime.date.today()
        self.year = self.today.year
        self.month = self.today.month
        self.day = self.today.day

    def update(self) -> None:
        """Update data

            Args:
                None
            Return:
                None
        """
        self.day -= 10

        if self.day <= 0:
            self.day += 28
            self.month -= 1

        if self.month == 0:
            self.month = 12
            self.year -= 1

        self._update_TWII(f"{self.year}-{self.month}-{self.day}")

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
        sql = f'INSERT INTO TWII (`date`, `Close`) VALUES ("{self._TWII_table_data["Date"]}", "{self._TWII_table_data["Close"]}")'

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