from fredapi import Fred
import datetime
import MySQLdb
import MySQLdb.cursors
import pandas as pd
import sys
from dateutil.relativedelta import relativedelta
import warnings
warnings.filterwarnings("ignore")

class FredUpdate():
    """Update Fed data, include
        1. CPI => Consumer Price Index
        2. FED => Federal Funds Effective Rate
        3. AHE => Average Hourly Earnings of All Employees
        4. UMCS => University of Michigan: Consumer Sentiment
        5. PPI => Producer Price Index by Commodity: All Commodities
        6. PCE => Personal Consumption Expenditures Price Index
        7. RPCEG => Real Personal Consumption Expenditures: Goods
    """
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                                   db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self.fred = Fred(api_key = '5e9f3697af9fec1e2e4c436a02a614b1')
        self.CPI_data = None
        self.FED_data = None
        self.AHE_data = None
        self.UMCS_data = None
        self.PPI_data = None
        self.PCE_data = None
        self.RPCEG_data = None

    def update(self) -> None:
        """Update data

            Args:
                None
            Return:
                None
        """
        last_month = (datetime.datetime.today() - relativedelta(months = 1)).replace(day=1)
        last_year = last_month - relativedelta(years = 1)
        last_month = last_month.strftime("%Y-%m-%d")
        last_year = last_year.strftime("%Y-%m-%d")

        self._update_CPI(last_year)
        self._update_FED(last_month)
        self._update_AHE(last_year)
        self._update_UMCS(last_month)
        self._update_PPI(last_year)
        self._update_PCE(last_year)
        self._update_RPCEG(last_year)

    def _update_CPI(self, start_date : str) -> None:
        """Update CPI

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.CPI_data = self.fred.get_series('CPIAUCSL', start_date)

        if len(self.CPI_data) < 13:
            return
        
        if not self._isDuplicate(self.CPI_data.index[-1].strftime("%Y-%m-%d"), "CPI"):
            new_data = round(100 * ((self.CPI_data[-1] - self.CPI_data[0]) / self.CPI_data[0]), 2)
            self._update_to_sql(self.CPI_data.index[-1].strftime("%Y-%m-%d"), new_data, "CPI")

    def _update_FED(self, start_date : str) -> None:
        """Update FED

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.FED_data = self.fred.get_series('FEDFUNDS', start_date)

        if not self._isDuplicate(self.FED_data.index[-1].strftime("%Y-%m-%d"), "FED"):
            self._update_to_sql(self.FED_data.index[-1].strftime("%Y-%m-%d"), self.FED_data[-1], "FED")

    def _update_AHE(self, start_date : str) -> None:
        """Update AHE

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.AHE_data = self.fred.get_series('CES0500000003', start_date)

        if len(self.AHE_data) < 13:
            return

        if not self._isDuplicate(self.AHE_data.index[-1].strftime("%Y-%m-%d"), "AHE"):
            new_data = round(100 * ((self.AHE_data[-1] - self.AHE_data[0]) / self.AHE_data[0]), 2)
            self._update_to_sql(self.AHE_data.index[-1].strftime("%Y-%m-%d"), new_data, "AHE")

    def _update_UMCS(self, start_date : str) -> None:
        """Update UMCS

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.UMCS_data = self.fred.get_series('UMCSENT', start_date)

        if len(self.UMCS_data) == 0:
            return
        
        if not self._isDuplicate(self.UMCS_data.index[-1].strftime("%Y-%m-%d"), "UMCS"):
            self._update_to_sql(self.UMCS_data.index[-1].strftime("%Y-%m-%d"), self.UMCS_data[-1], "UMCS")

    def _update_PPI(self, start_date : str) -> None:
        """Update PPI

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.PPI_data = self.fred.get_series('PPIACO', start_date)
        
        if len(self.PPI_data) < 13:
            return

        if not self._isDuplicate(self.PPI_data.index[-1].strftime("%Y-%m-%d"), "PPI"):
            new_data = round(100 * ((self.PPI_data[-1] - self.PPI_data[0]) / self.PPI_data[0]), 2)
            self._update_to_sql(self.PPI_data.index[-1].strftime("%Y-%m-%d"), new_data, "PPI")

    def _update_PCE(self, start_date : str) -> None:
        """Update PCE

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.PCE_data = self.fred.get_series('PCEPI', start_date)

        if len(self.PCE_data) < 13:
            return

        if not self._isDuplicate(self.PCE_data.index[-1].strftime("%Y-%m-%d"), "PCE"):
            new_data = round(100 * ((self.PCE_data[-1] - self.PCE_data[0]) / self.PCE_data[0]), 2)
            self._update_to_sql(self.PCE_data.index[-1].strftime("%Y-%m-%d"), new_data, "PCE")

    def _update_RPCEG(self, start_date : str) -> None:
        """Update RPCEG

            Args:
                start_date : (str) start date
            Return:
                None
        """
        self.RPCEG_data = self.fred.get_series('DGDSRX1', start_date)
        
        if len(self.RPCEG_data) < 13:
            return

        if not self._isDuplicate(self.RPCEG_data.index[-1].strftime("%Y-%m-%d"), "RPCEG"):
            new_data = round(100 * ((self.RPCEG_data[-1] - self.RPCEG_data[0]) / self.RPCEG_data[0]), 2)
            self._update_to_sql(self.RPCEG_data.index[-1].strftime("%Y-%m-%d"), new_data, "RPCEG")

    def _update_to_sql(self, date : str, data : float, table : str) -> None:
        """Update data to DB

            Args:
                date : (str) newest date
                data : (float) newest data
                table : (str) table name
            Return:
                None
        """
        sql = f'INSERT INTO {table} (`date`, `{table}`) VALUES ("{date}", "{data}")'
        
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
    fredUpdate = FredUpdate()

    sys.stderr = open("/home/cosbi/桌面/financialData/FRED/" + str(datetime.date.today()) + '.log', 'w')
    fredUpdate.update()