import json
import MySQLdb
import MySQLdb.cursors
import datetime
import sys
import pandas as pd
import calendar
from typing import List, Dict

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

class TopTicker():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self._buy_pattern = ["增加持股", "中立轉買進", "買進", "買進–維持買進", "買入", "強力買進", "維持買進", "強力買進/買進", "優於大盤", "buy", "Buy", "BUY", "Overweight"]
        self._hold_pattern = ["維持中立", "中立", "買進轉中立", "持有-超越同業(維持評等)", "hold", "Hold", "HOLD", "Neutral", "neutral"]
        self._sell_pattern = ["賣出", "劣於大盤", "sell", "Sell", "SELL", "Underweight", "REDUCE", "reduce", "Reduce"]
        self._interval_pattern = ["區間操作"]

    def _get_month_data(self, start_date : str,  end_date : str) -> pd.DataFrame:
        query = f"SELECT ticker_list.ID, financialData.date, financialData.investmentCompany, financialData.recommend \
            FROM financialData INNER JOIN ticker_list ON financialData.ticker_id = ticker_list.ID WHERE date BETWEEN %s AND %s"
        param = (start_date, end_date)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return result.sort_values(by = ['ID', 'date'])

    def _filter_top(self, data : pd.DataFrame, top : int) -> Dict:
        ele_quantity = data["ID"].value_counts()[:top]

        return ele_quantity.to_dict()

    def _recommend_distribution(self, top_data : pd.DataFrame, top: Dict) -> Dict:
        result = {}

        for ticker in top.keys():
            temp = top_data[top_data["ID"] == ticker]

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
            result[ticker] = recommend_distribution

        return result

    def run(self) -> None:
        today_date = datetime.datetime.now().today()
        start_date = datetime.datetime(today_date.year, today_date.month, 1).strftime("%Y-%m-%d")
        end_date = datetime.datetime(today_date.year, today_date.month, calendar.monthrange(today_date.year, today_date.month)[1]).strftime('%Y-%m-%d')

        month_data = self._get_month_data(start_date, end_date)
        top = self._filter_top(month_data, 20)
        month_data = month_data[month_data["ID"].isin(top.keys())]
        recommend_distribution_result = self._recommend_distribution(month_data, top)

        for x in recommend_distribution_result:
            print(f"ticker_id: {x} summary is {recommend_distribution_result[x]['result']}")
            # temp = 0
            # for y in recommend_distribution_result[x]:
            #     if y == "result":
            #         continue
            #     temp += recommend_distribution_result[x][y]

            # if temp != top[x]:
            #     print(top[x])
            #     print(recommend_distribution_result[x])

        # print(recommend_distribution_result)

if __name__ == "__main__":
    top_ticker = TopTicker()

    top_ticker.run()