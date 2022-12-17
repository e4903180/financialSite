import yfinance as yf
import MySQLdb
import MySQLdb.cursors
import datetime
import sys

class TWII():
    def __init__(self) -> None:
        self._TWII_table_data = None
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def get_data(self) -> None:
        self._TWII_table_data = yf.download("^TWII", progress = False, show_errors = False)

        self._TWII_table_data = self._TWII_table_data.reset_index().iloc[-1]
        self._TWII_table_data["Date"] = self._TWII_table_data["Date"].strftime("%Y-%m-%d")
        self._TWII_table_data["Close"] = self._TWII_table_data["Close"].round(2)

    def update_to_sql(self) -> None:
        sql = f'INSERT INTO TWII (`date`, `Close`) VALUES ("{self._TWII_table_data["Date"]}", "{self._TWII_table_data["Close"]}")'

        self._cursor.execute(sql)
        self._db.commit()


if __name__ == "__main__":
    twii = TWII()

    sys.stderr = open("/home/cosbi/桌面/financialData/TWII/" + str(datetime.date.today()) + '.log', 'w')
    twii.get_data()
    twii.update_to_sql()