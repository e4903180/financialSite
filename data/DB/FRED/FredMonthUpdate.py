from fredapi import Fred
import datetime
import MySQLdb
import MySQLdb.cursors
import pandas as pd
import sys
from dateutil.relativedelta import relativedelta
import warnings
import json

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))
warnings.filterwarnings("ignore")
sys.path.append(root_path["PROJECT_ROOT_PATH"])
from service.LogNotifyService.logNotifyService import LogNotifyService

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
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                     db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self.fred = Fred(api_key = '5e9f3697af9fec1e2e4c436a02a614b1')

    def update(self) -> None:
        """Update data

            Args:
                None
            Return:
                None
        """
        month_data_name = {
            "FED" : "FEDFUNDS",
            "UMCS" : "UMCSENT"
        }

        year_delta_data_name = {
            "CPI" : "CPIAUCSL",
            "AHE" : "CES0500000003",
            "PPI" : "PPIACO",
            "PCE" : "PCEPI",
            "RPCEG" : "DGDSRX1"
        }
        last_6_month = ((datetime.datetime.today() - relativedelta(months = 6)).replace(day = 1)).strftime("%Y-%m-%d")
        last_year = ((datetime.datetime.today() - relativedelta(months = 1)).replace(day = 1) - relativedelta(years = 1)).strftime("%Y-%m-%d")

        for name in month_data_name:
            self._update_month_data(last_6_month, name, month_data_name[name])

        for name in year_delta_data_name:
            self._update_year_delta_data(last_year, name, year_delta_data_name[name])

    def _update_year_delta_data(self, start_date : str, table_name : str, data_name : str) -> None:
        """Update year delta data

            Args:
                start_date : (str) start date
                table_name : (str) table name
                data_name : (str) data name

            Return:
                None
        """
        data = self.fred.get_series(data_name, start_date)

        if len(data) < 13:
            return
        
        if not self._isDuplicate(data.index[-1].strftime("%Y-%m-%d"), table_name):
            new_data = round(100 * ((data[-1] - data[0]) / data[0]), 2)
            self._insert(data.index[-1].strftime("%Y-%m-%d"), new_data, table_name)

    def _update_month_data(self, start_date : str, table_name : str, data_name : str) -> None:
        """Update month data

            Args:
                start_date : (str) start date
                table_name : (str) table name
                data_name : (str) data name

            Return:
                None
        """
        data = self.fred.get_series(data_name, start_date)

        for i in range(len(data)):
            if not self._isDuplicate(data.index[i].strftime("%Y-%m-%d"), table_name):
                self._insert(data.index[i].strftime("%Y-%m-%d"), data[i], table_name)

    def _insert(self, date : str, data : float, table : str) -> None:
        """Update data to DB

            Args:
                date : (str) newest date
                data : (float) newest data
                table : (str) table name
            Return:
                None
        """
        query = f'INSERT INTO {table} (`date`, {table}) VALUES (%s, %s)'
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
    log_path = f"{root_path['FRED_MONTH_UPDATE_LOG_PATH']}/{str(datetime.date.today())}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    fred_update = FredUpdate()

    try:
        fred_update.update()
    except Exception as e:
        print(e)
        log_notify_service.send_email("Fred月更新狀態", str(e))