from utils.finlabTool import crawl_price
import MySQLdb
import MySQLdb.cursors
import datetime
import pandas as pd
from typing import List
from tqdm import trange
import sqlalchemy

class TwStock():
    """Use finlabTool create taiwan stock database
    """

    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                    db = "twStock", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        # pandas to_sql must use sqlalchemy
        self.engine = sqlalchemy.create_engine('mysql+pymysql://debian-sys-maint:CEMj8ptYHraxNxFt@localhost:3306/twStock')

    def init_twStock(self, start_date, end_date) -> None:
        """Get stock price research through finLabTool

            Args :
                start_date : (str) start date
                end_date : (str) end date
            Return :
                None
        """
        date = self._getEveryDay(start_date, end_date)

        for i in trange(len(date)):
            result = crawl_price(date[i][0])
            
            if not result.empty:
                drop = []

                for j in trange(len(result)):                    
                    key = self._get_foreign_key_id(result.iloc[j]["ticker_id"])

                    if key == -1:
                        drop.append(j)
                        continue

                    result.iloc[j]["ticker_id"] = key

                result = result.drop(drop)
                result = result.reset_index(drop = True)
                result["Date"] = [date[i][1] for x in range(len(result))]

                result.to_sql(name = "twStock", con = self.engine, if_exists = "append", index = False)

    def _get_foreign_key_id(self, stock_num : str) -> int:
        """Get the foreign key id through stock number

            Args :
                stock_num : (str) stock number
            Return :
                key : (int) foreign key
        """
        query = "SELECT ID FROM ticker_list WHERE stock_num='%s'" % (stock_num)

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return -1
        
        return result["ID"][0]

    def _getEveryDay(self, start_date : str, end_date : str) -> List:
        """Create a continuous date list

            Args :
                start_date : (str) start date
                end_date : (str) end date
            Return :
                date : (List[List[str, str]]) date list for two format %Y%m%d and %Y-%m-%d
        """
        start = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.datetime.strptime(end_date, "%Y-%m-%d")
        date = []

        while start <= end:
            date.append([start.strftime("%Y%m%d"), start.strftime("%Y-%m-%d")])
            start += datetime.timedelta(days = 1)
        return date
    
    def _isExisted(self, stock_num : str) -> None:
        """Check if data is existed

            Args :
                ticker : (str) stock number
        """
        query = "SELECT * FROM twStock WHERE ticker='%s'" % (stock_num)

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if len(result) == 0:
            return False

        return True

    def _insert(self, key : int, data : List) -> None:
        """Insert new data to table

            Args :
                key : (int) foreign key
                data : (List) new data to insert
            Return :
                None
        """
        query = "INSERT INTO twStock (`ticker_id`, `Date`, `Open`, `High`, `Low`, `Close`, `Volume`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s')"\
            % (key, data[0], data[1], data[2], data[3], data[4], data[5])

        self._cursor.execute(query)
        self._db.commit()

if __name__ == "__main__":
    TS = TwStock()

    TS.init_twStock("2017-01-01", "2023-01-03")