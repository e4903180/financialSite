import datetime
import sys
import MySQLdb
import MySQLdb.cursors
import yfinance as yf
import pandas as pd

class DxyJnkUpdate():
    """Update yfinance data, include
        1. DXY => US Dollar/USDX - Index – Cash
        2. JNK => SPDR Bloomberg High Yield Bond ETF
    """

    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self.JNK_table_data = None
        self.DXY_table_data = None
        self.today = datetime.date.today()
        self.year = self.today.year
        self.month = self.today.month
        self.day = self.today.day

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
        self.day -= 10

        if self.day <= 0:
            self.day += 28
            self.month -= 1

        if self.month == 0:
            self.month = 12
            self.year -= 1

        self._update_JNK(f"{self.year}-{self.month}-{self.day}")
        self._update_DXY(f"{self.year}-{self.month}-{self.day}")

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
    sys.stderr = open("/home/cosbi/桌面/financialData/DXY_JNK/" + str(datetime.date.today()) + '.log', 'w')

    DJU = DxyJnkUpdate()
    DJU.update()