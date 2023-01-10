from utils.finlabTool import crawl_price
import MySQLdb
import MySQLdb.cursors
import datetime
import pandas as pd
from typing import List
import json
from tqdm import trange
from typing import List

class TwStock():
    def __init__(self) -> None:
        self._date = []
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                    db = "twStock", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self._getEveryDay()

    def get_price(self) -> None:
        for i in trange(len(self._date)):
            result = crawl_price(self._date[i][0])
            result = result.replace("--", 0)

            for j in trange(len(result)):
                temp = result.iloc[j]
                key = self._get_foreign_key_id(temp["證券代號"])
                
                if key == -1:
                    continue
                
                self._insert(key, [self._date[i][1], float(temp["開盤價"]), float(temp["最高價"]), float(temp["最低價"]), float(temp["收盤價"]), float(temp["成交股數"])])

    def _get_foreign_key_id(self, stock_num : str) -> int:
        """Find the ticker_list ID

            Args:
                stock_num : (str) stock number
            
            Return:
                If stock_num exist return ID
                else return -1
        """
        query = "SELECT ID FROM ticker_list WHERE stock_num='%s'" % (stock_num)

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return -1
        
        return result["ID"][0]

    def _getEveryDay(self):
        start = datetime.datetime.strptime("2017-01-01", "%Y-%m-%d")
        end = datetime.datetime.strptime("2023-01-03", "%Y-%m-%d")

        while start <= end:
            self._date.append([start.strftime("%Y%m%d"), start.strftime("%Y-%m-%d")])
            start += datetime.timedelta(days = 1)
    
    def _isExisted(self, ticker : str) -> None:
        query = "SELECT * FROM twStock WHERE ticker='%s'" % (ticker)

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if len(result) == 0:
            return False

        return True

    def _insert(self, key : int, data : List) -> None:
        query = "INSERT INTO twStock (`ticker_id`, `Date`, `Open`, `High`, `Low`, `Close`, `Volume`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s')"\
            % (key, data[0], data[1], data[2], data[3], data[4], data[5])

        self._cursor.execute(query)
        self._db.commit()

    def _update(self, ticker : str, data : List) -> None:
        query = "SELECT `data` FROM twStock WHERE `ticker`='%s'" % (ticker)

        self._cursor.execute(query)
        self._db.commit()

        result = json.loads(self._cursor.fetchall()[0]["data"])
        result.append(data)

        convert_data = json.dumps(result)
        
        query = "UPDATE twStock SET `data`='%s' WHERE `ticker`='%s'" % (convert_data, ticker)

        self._cursor.execute(query)
        self._db.commit()

if __name__ == "__main__":
    TS = TwStock()

    TS.get_price()