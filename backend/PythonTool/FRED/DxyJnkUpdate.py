import pandas as pd
import datetime
import sys
import MySQLdb
import MySQLdb.cursors
import yfinance as yf

class DxyJnkUpdate():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self.JNK_table_data = None
        self.DXY_table_data = None

    def _update_JNK(self) -> None:
        self.JNK_table_data = yf.download("JNK", progress = False, show_errors = False)
        self.JNK_table_data = self.JNK_table_data.reset_index().iloc[-1]
        self.JNK_table_data["Date"] = self.JNK_table_data["Date"].strftime("%Y-%m-%d")
        self.JNK_table_data["Close"] = self.JNK_table_data["Close"].round(2)
        self.JNK_table_data = self.JNK_table_data.fillna(0.0)

        self._update_to_sql([self.JNK_table_data["Date"], self.JNK_table_data["Close"]], "JNK")
    
    def _update_DXY(self) -> None:
        self.DXY_table_data = yf.download("DX-Y.NYB", progress = False, show_errors = False)

        self.DXY_table_data = self.DXY_table_data.reset_index().iloc[-2]
        self.DXY_table_data["Date"] = self.DXY_table_data["Date"].strftime("%Y-%m-%d")
        self.DXY_table_data["Close"] = self.DXY_table_data["Close"].round(2)
        self.DXY_table_data = self.DXY_table_data.fillna(0.0)

        self._update_to_sql([self.DXY_table_data["Date"], self.DXY_table_data["Close"]], "DXY")

    def update(self) -> None:
        self._update_JNK()
        self._update_DXY()

    def _update_to_sql(self, data : list, table : str) -> None:
        sql = f'INSERT INTO {table} (`date`, `Close`) VALUES ("{data[0]}", "{data[1]}")'

        self._cursor.execute(sql)
        self._db.commit()

if __name__ == "__main__":
    sys.stderr = open("/home/cosbi/桌面/financialData/DXY_JNK/" + str(datetime.date.today()) + '.log', 'w')

    DJU = DxyJnkUpdate()
    DJU.update()