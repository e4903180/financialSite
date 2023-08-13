import json
import MySQLdb
import MySQLdb.cursors
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))

class PopularTicker():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def _get_financialData(self, day_delta : int) -> pd.DataFrame:
        """Get financialData

            Args :
                day_delta : (int) time interval
            
            Return :
                pd.DataFrame
        """
        start_date = (datetime.now() - timedelta(days = day_delta)).strftime("%Y-%m-%d")

        query = "SELECT ticker_list.stock_num, ticker_list.stock_name, ticker_list.class, financialData.ID, \
                financialData.date, financialData.investmentCompany, financialData.filename, financialData.recommend,\
                financialData.remark FROM financialData INNER JOIN ticker_list ON financialData.ticker_id = ticker_list.ID WHERE date>=%s"
        param = (start_date,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())
        return result.sort_values(by = ['stock_num', 'date'])
    
    def _get_news(self, day_delta : int) -> pd.DataFrame:
        """Get news data

            Args :
                day_delta : (int) time interval
            
            Return :
                pd.DataFrame
        """
        start_date = (datetime.now() - timedelta(days = day_delta)).strftime("%Y-%m-%d")

        query = "SELECT * FROM news WHERE date>=%s"
        param = (start_date,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())
        temp_title = []

        for i in range(len(result)):
            temp_title.append([result.iloc[i]["title"], result.iloc[i]["link"]])

        del result["link"]
        result["title"] = temp_title

        return result.sort_values(by = ['date', 'category'])
    
    def _filter_popular_from_financialData(self, data : pd.DataFrame, top : int) -> Dict:
        """Filter origin financial data

            Args :
                data : (pd.DataFrame) origin financial data
                top : (int) top ticker
            
            Return :
                ticker quantity : (Dict) 
                    ex :
                        {'1102': 4, '1101': 3, '1103': 1, '1104': 1, '1109': 1}
        """
        return data["stock_name"].value_counts()[:top].to_dict()
    
    def _calculate_popular_ticker(self, financialData : pd.DataFrame, news : pd.DataFrame, popular_ticker_list : Dict) -> Dict:
        """Calculate popular ticker

            Args :
                financialData : (pd.DataFrame) financialData
                news : (pd.DataFrame) news data
                popular_ticker_list : (Dict) popular ticker
            
            Return :
                Dict
        """
        result = {}

        # Filter raw financialData about popular ticker
        for key in popular_ticker_list:
            stock_num, stock_name = key.split(" ")

            temp_financialData = financialData[financialData["stock_name"] == key]

            result[stock_num] = {
                "stock_num" : stock_num,
                "stock_name" : stock_name,
                "financialDataQuantity" : popular_ticker_list[key],
                "financialData" : temp_financialData.to_dict(orient = "records"),
                "newsQuantity" : 0,
                "news" : []
            }
        
        # Filter raw news about popular ticker
        for i in range(len(news)):
            for key in popular_ticker_list:
                stock_num, stock_name = key.split(" ")

                if stock_name in news.iloc[i]["title"][0]:
                    result[stock_num]["news"].append(news.iloc[i].to_dict())
                    result[stock_num]["newsQuantity"] += 1
                    break

        return result

    def _get_foreign_key_id(self, stock_num : str) -> int:
        """Find the ticker_list ID

            Args:
                stock_num : (str) stock number
            
            Return:
                If stock_num exist return ID
                else return -1
        """
        query = "SELECT ID FROM ticker_list WHERE stock_num=%s;" 
        param = (stock_num,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return -1
        
        return result["ID"][0]

    def _truncate_table(self) -> None:
        """Clear table

            Args :
                None

            Return :
                None
        """
        query = "TRUNCATE TABLE popular_ticker"
        self._cursor.execute(query)
        self._db.commit()
    
    def _insert(self, ticker_id : int, financialData : Dict, news : Dict) -> None:
        """Insert data to db

            Args :
                ticker_id : (int) ticker id
                financialData : (Dict) financialData
                news : (Dict) news data

            Return :
                None
        """
        query = "INSERT INTO popular_ticker(ticker_id, financialData, news) VALUES (%s, %s, %s)"
        param = (ticker_id, json.dumps(financialData), json.dumps(news))

        self._cursor.execute(query, param)
        self._db.commit()

    def _update_2_db(self, data : Dict) -> None:
        """Update data to db

            Args :
                data : (Dict) result
            
            Return :
                None
        """
        for key in data:
            foreign_id = self._get_foreign_key_id(key)

            if foreign_id == -1:
                continue

            self._insert(foreign_id, data[key]["financialData"], data[key]["news"])

    def run(self, day_delta : int = 30, top : int = 10) -> None:
        """Run

            Args :
                day_delta : (int) time interval
                top : (int) top ticker
            
            Return :
                None
        """
        self._truncate_table()
        
        day_delta = int(day_delta)
        top = int(top)

        financialData = self._get_financialData(day_delta)
        news = self._get_news(day_delta)

        popular_ticker_list = self._filter_popular_from_financialData(financialData, top)
        result = self._calculate_popular_ticker(financialData, news, popular_ticker_list)

        self._update_2_db(result)

if __name__ == "__main__":
    popular_ticker = PopularTicker()

    popular_ticker.run()