import json
import MySQLdb
import MySQLdb.cursors
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict

root_path = json.load(open("../../../root_path.json"))
recommend_json = json.load(open("../../../recommend.json"))

class PopularTicker():
    def __init__(self, db : MySQLdb, cursor) -> None:
        self._db = db
        self._cursor = cursor

    def _get_data(self, day_delta : int) -> pd.DataFrame:
        start_date = (datetime.now() - timedelta(days = day_delta)).strftime("%Y-%m-%d")

        query = "SELECT ticker_list.stock_num, ticker_list.stock_name, ticker_list.class, financialData.ID, \
                financialData.date, financialData.investmentCompany, financialData.filename, financialData.recommend,\
                financialData.remark FROM financialData INNER JOIN ticker_list ON financialData.ticker_id = ticker_list.ID WHERE date>=%s"
        param = (start_date,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())
        return result.sort_values(by = ['stock_num', 'date'])
    
    def _filter_popular(self, data : pd.DataFrame, top : int) -> Dict:
        """Filter origin data with recommend with max quantity

            Args :
                data : (pd.DataFrame) origin data
                top : (int) top ticker
            
            Return :
                ticker quantity : (Dict) 
                    ex :
                        {'1102': 4, '1101': 3, '1103': 1, '1104': 1, '1109': 1}
        """
        return data["stock_num"].value_counts()[:top].to_dict()
    
    def _transform_formate(self, data : pd.DataFrame, popular_ticker_list : Dict) -> Dict:
        result = {}

        for key in popular_ticker_list:
            temp = data[data["stock_num"] == key]

            result[key] = {
                "stock_name" : temp.iloc[0]["stock_name"],
                "quantity" : popular_ticker_list[key],
                "data" : temp.to_dict(orient = "records")
            }

        return result

    def run(self, day_delta : int = 7, top : int = 10) -> None:
        data = self._get_data(day_delta)
        popular_ticker_list = self._filter_popular(data, top)
        result = self._transform_formate(data, popular_ticker_list)

        print(result)

if __name__ == "__main__":
    db_config = json.load(open("../../../../../db_config.json"))

    db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
    cursor = db.cursor()

    popular_ticker = PopularTicker(db, cursor)

    popular_ticker.run()