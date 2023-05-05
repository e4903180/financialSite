import json
import MySQLdb
import MySQLdb.cursors
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict

root_path = json.load(open("../../root_path.json"))
recommend_json = json.load(open("../../recommend.json"))

class PopularTicker():
    def __init__(self, db : MySQLdb, cursor) -> None:
        self._db = db
        self._cursor = cursor

    def _get_financialData(self, day_delta : int) -> pd.DataFrame:
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
        start_date = (datetime.now() - timedelta(days = day_delta)).strftime("%Y-%m-%d")

        query = "SELECT * FROM news WHERE date>=%s"
        param = (start_date,)

        self._cursor.execute(query, param)
        self._db.commit()

        return pd.DataFrame.from_dict(self._cursor.fetchall())
    
    def _filter_popular_from_financialData(self, data : pd.DataFrame, top : int) -> Dict:
        """Filter origin financial data

            Args :
                data : (pd.DataFrame) origin data
                top : (int) top ticker
            
            Return :
                ticker quantity : (Dict) 
                    ex :
                        {'1102': 4, '1101': 3, '1103': 1, '1104': 1, '1109': 1}
        """
        return data["stock_name"].value_counts()[:top].to_dict()
    
    def _calculate_popular_ticker(self, financialData : pd.DataFrame, news : pd.DataFrame, popular_ticker_list : Dict) -> Dict:
        result = {}

        # Filter raw financialData about popular ticker
        for key in popular_ticker_list:
            stock_num, stock_name = key.split(" ")

            temp_financialData = financialData[financialData["stock_name"] == key]

            result[stock_num] = {
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

                if stock_name in news.iloc[i]["title"]:
                    result[stock_num]["news"].append(news.iloc[i].to_dict())
                    result[stock_num]["newsQuantity"] += 1
                    break

        return result

    def run(self, day_delta : int = 20, top : int = 10) -> None:
        day_delta = int(day_delta)
        top = int(top)

        financialData = self._get_financialData(day_delta)
        news = self._get_news(day_delta)

        popular_ticker_list = self._filter_popular_from_financialData(financialData, top)
        result = self._calculate_popular_ticker(financialData, news, popular_ticker_list)

        return result

if __name__ == "__main__":
    db_config = json.load(open("../../../../../db_config.json"))

    db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
    cursor = db.cursor()

    popular_ticker = PopularTicker(db, cursor)

    popular_ticker.run()