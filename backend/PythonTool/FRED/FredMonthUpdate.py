from fredapi import Fred
import pandas as pd
import datetime
import sys
import MySQLdb
import MySQLdb.cursors
from tqdm import trange

class FredUpdate():
    def __init__(self) -> None:
        tonow = datetime.datetime.now()

        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                                   db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self.fred = Fred(api_key = '5e9f3697af9fec1e2e4c436a02a614b1')
        self.CPI_data = None
        self.FED_data = None
        self.AHE_data = None
        self.UMCS_data = None

        self.year = tonow.year - 1
        self.month = tonow.month - 1

    def update(self) -> None:
        # self._update_CPI()
        # self._update_FED()
        # self._update_AHE()
        # self._update_UMCS()

    def _update_CPI(self) -> None:
        self.CPI_data = self.fred.get_series('CPIAUCSL', str(self.year) + "-" + str(self.month) + "-01")
        new_data = round(100 * ((self.CPI_data[-1] - self.CPI_data[-1 - 12]) / self.CPI_data[-1 - 12]), 2)

        self._update_to_sql([self.CPI_data.index[-1].strftime("%Y-%m-%d"), new_data], "CPI")

    def _update_FED(self) -> None:
        self.FED_data = self.fred.get_series('FEDFUNDS', str(self.year + 1) + "-" + str(self.month) + "-01")

        self._update_to_sql([self.FED_data.index[0].strftime("%Y-%m-%d"), self.FED_data[0]], "FED")

    def _update_AHE(self) -> None:
        self.AHE_data = self.fred.get_series('CES0500000003', str(self.year) + "-" + str(self.month) + "-01")
        new_data = round(100 * ((self.AHE_data[-1] - self.AHE_data[-1 - 12]) / self.AHE_data[-1 - 12]), 2)

        self._update_to_sql([self.AHE_data.index[-1].strftime("%Y-%m-%d"), new_data], "AHE")

    def _update_UMCS(self) -> None:
        self.UMCS_data = self.fred.get_series('UMCSENT', str(self.year + 1) + "-" + str(self.month) + "-01")
        self._update_to_sql([self.UMCS_data.index[-1].strftime("%Y-%m-%d"), self.UMCS_data[-1]], "UMCS")

    def _update_to_sql(self, data : list, table : str) -> None:
        sql = f'INSERT INTO {table} (`date`, `{table}`) VALUES ("{data[0]}", "{data[1]}")'
        
        self._cursor.execute(sql)
        self._db.commit()


if __name__ == "__main__":
    fredUpdate = FredUpdate()

    sys.stderr = open("/home/cosbi/桌面/financialData/FRED/" + str(datetime.date.today()) + '.log', 'w')
    fredUpdate.update()
