import json
import MySQLdb
import MySQLdb.cursors
import pandas as pd
from typing import Dict

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))
recommend = json.load(open("../../convertedRecommend.json"))

class TopTicker():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self._buy_pattern = recommend["buy"]

        self._hold_pattern = recommend["hold"]

        self._sell_pattern = recommend["sell"]

        self._interval_pattern = recommend["interval"]

    def _get_month_data(self, start_date : str,  end_date : str) -> pd.DataFrame:
        query = f"SELECT ticker_list.stock_num, ticker_list.stock_name, financialData.date, financialData.investmentCompany, financialData.recommend \
                FROM financialData INNER JOIN ticker_list ON financialData.ticker_id = ticker_list.ID WHERE date BETWEEN %s AND %s"
        param = (start_date, end_date)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return result.sort_values(by = ['stock_num', 'date'])

    def _filter_top(self, data : pd.DataFrame, top : int, recommend : str) -> Dict:
        if recommend == "all":
            temp = data

        elif recommend == "buy":
            temp = data[data["recommend"].isin(self._buy_pattern)]

        elif recommend == "hold":
            temp = data[data["recommend"].isin(self._hold_pattern)]
        
        elif recommend == "sell":
            temp = data[data["recommend"].isin(self._sell_pattern)]
        
        elif recommend == "interval":
            temp = data[data["recommend"].isin(self._interval_pattern)]
            
        ele_quantity = temp["stock_num"].value_counts()[:top]

        return ele_quantity.to_dict()

    def _recommend_distribution(self, top_data : pd.DataFrame, top: Dict) -> Dict:
        result = {}

        for ticker in top.keys():
            temp = top_data[top_data["stock_num"] == ticker]

            recommend_distribution = {
                "buy" : 0,
                "hold" : 0,
                "sell" : 0,
                "interval" : 0,
            }

            for recommend in temp["recommend"].to_list():
                recommend = recommend.replace(" ", "")
                if recommend in self._buy_pattern:
                    recommend_distribution["buy"] += 1

                elif recommend in self._hold_pattern:
                    recommend_distribution["hold"] += 1
                
                elif recommend in self._sell_pattern:
                    recommend_distribution["sell"] += 1

                elif recommend in self._interval_pattern:
                    recommend_distribution["interval"] += 1
            
            recommend_distribution["result"] = max(recommend_distribution, key = recommend_distribution.get)

            result[ticker] = {"stock_num" : ticker, "stock_name" : temp.iloc[0]["stock_name"], "recommend_distribution" : recommend_distribution}

        return result

    def run(self, start_date : str, end_date : str, top : int = 20, recommend : str = "all") -> None:
        month_data = self._get_month_data(start_date, end_date)
        top_ticker_list = self._filter_top(month_data, top, recommend)
        month_data = month_data[month_data["stock_num"].isin(top_ticker_list.keys())]

        recommend_distribution_result = self._recommend_distribution(month_data, top_ticker_list)
        print(recommend_distribution_result)

if __name__ == "__main__":
    top_ticker = TopTicker()

    top_ticker.run("2023-01-01", "2023-04-10", 20, "all")