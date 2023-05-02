import json
import MySQLdb
import MySQLdb.cursors
import pandas as pd
from typing import Dict, List

root_path = json.load(open("../../root_path.json"))
recommend_json = json.load(open("../../recommend.json"))

class TopTicker():
    """Find the top ticker of financialData
    """
    def __init__(self, db : MySQLdb, cursor) -> None:
        self._db = db
        self._cursor = cursor

        self._buy_pattern = recommend_json["buy"]

        self._hold_pattern = recommend_json["hold"]

        self._sell_pattern = recommend_json["sell"]

        self._interval_pattern = recommend_json["interval"]

    def _get_data(self, start_date : str, end_date : str, category : str, type : str) -> pd.DataFrame:
        """Get the data from financialData table

            Args :
                start_date : (str) start date
                end_date : (str) end date
                category : (str) class of ticker ex: 水泥
                type : (str) type of ticker ex: 上市

            Return :
                result : (pd.DataFrame) result of query 
        """
        query = f"SELECT ticker_list.stock_num, ticker_list.stock_name, ticker_list.class, financialData.ID, \
                financialData.date, financialData.investmentCompany, financialData.filename, financialData.recommend,\
                financialData.remark FROM financialData INNER JOIN ticker_list ON financialData.ticker_id = ticker_list.ID \
                WHERE date BETWEEN %s AND %s"
        param = (start_date, end_date)

        if category != "all":
            query += " AND ticker_list.class=%s"
            param += (category,)

        if type == "上市":
            query += " AND ticker_list.class NOT LIKE %s"
            param += ("%櫃%",)

        elif type == "上櫃":
            query += " AND ticker_list.class LIKE %s"
            param += ("%櫃%",)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return result.sort_values(by = ['stock_num', 'date'])

    def _filter_top(self, data : pd.DataFrame, top : int, recommend : str) -> Dict:
        """Filter origin data with recommend with max quantity

            Args :
                data : (pd.DataFrame) origin data
                recommend : (str) recommend [buy, hold, sell, interval]
            
            Return :
                ticker quantity : (Dict) 
                    ex :
                        {'1102': 4, '1101': 3, '1103': 1, '1104': 1, '1109': 1}
        """
        temp = data

        # Filter by recommend pattern
        if recommend == "buy":
            temp = data[data["recommend"].isin(self._buy_pattern)]

        elif recommend == "hold":
            temp = data[data["recommend"].isin(self._hold_pattern)]
        
        elif recommend == "sell":
            temp = data[data["recommend"].isin(self._sell_pattern)]
        
        elif recommend == "interval":
            temp = data[data["recommend"].isin(self._interval_pattern)]
        
        ele_quantity = temp["stock_num"].value_counts()[:top]

        return ele_quantity.to_dict()

    def _recommend_distribution(self, top_data : pd.DataFrame, top: Dict) -> List:
        """Distribution of recommend

            Args :
                top_data : (pd.DataFrame) origin data
                top : (Dict) top ticker
                    ex :
                        {'1102': 4, '1101': 3, '1103': 1, '1104': 1, '1109': 1}

            Return :
                result : (Dict)
                    ex:
                        {
                            '1102': {
                                'stock_num': '1102',
                                'stock_name': '1102 亞泥',
                                'category': '水泥',
                                'quantity': 4,
                                'recommend_distribution': {
                                    'buy': 0,
                                    'hold': 4,
                                    'sell': 0,
                                    'interval': 0,
                                    'result': 'hold'
                                }
                            },
                            '1101': {
                                'stock_num': '1101',
                                'stock_name': '1101 台泥',
                                'quantity': 3,
                                'category': '水泥',
                                'recommend_distribution': {
                                    'buy': 2,
                                    'hold': 1,
                                    'sell': 0,
                                    'interval': 0,
                                    'result': 'buy'
                                }
                            }
                        } 
        """
        result = []

        for ticker in top.keys():
            # Filter top ticker from origin data
            temp = top_data[top_data["stock_num"] == ticker]

            recommend_distribution = {
                "buy" : 0,
                "hold" : 0,
                "sell" : 0,
                "interval" : 0,
            }

            # Calculate all recommend quantity
            i = 0
            for recommend in temp["recommend"].to_list():
                if recommend in self._buy_pattern:
                    recommend_distribution["buy"] += 1

                elif recommend in self._hold_pattern:
                    recommend_distribution["hold"] += 1
                
                elif recommend in self._sell_pattern:
                    recommend_distribution["sell"] += 1

                elif recommend in self._interval_pattern:
                    recommend_distribution["interval"] += 1
                
                else:
                    print(temp.iloc[i])
                    print(recommend, len(recommend))
                i += 1
            
            # Calculate the max recommed 
            recommend_distribution["result"] = max(recommend_distribution, key = recommend_distribution.get)

            result.append({"stock_num" : ticker, "stock_name" : temp.iloc[0]["stock_name"], "quantity" : top[ticker],
                        "category" : temp.iloc[0]["class"], "recommend_distribution" : recommend_distribution})

        top_data["stock_num"] = pd.Categorical(top_data["stock_num"], ordered = True, categories = top.keys())
        top_data = top_data.sort_values("stock_num")
        
        return {"recommend_result" : result, "row_data" : top_data.to_dict(orient = "records")}

    def run(self, start_date : str, end_date : str, top : int = 10, recommend : str = "all", category : str = "all", type : str = "all") -> None:
        """Run

            Args :
                start_date : (str) start date
                end_date : (str) end date
                top : (int) top ticker
                recommend : (str) recommend [buy, hold, sell, interval]
                category : (str) class of ticker ex: 水泥
                type : (str) type of ticker ex: 上市

            Return :
                None 
        """
        data = self._get_data(start_date, end_date, category, type)
        top_ticker_list = self._filter_top(data, top, recommend)
        data = data[data["stock_num"].isin(top_ticker_list.keys())]

        return self._recommend_distribution(data, top_ticker_list)

if __name__ == "__main__":
    db_config = json.load(open("../../../db_config.json"))

    db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
    cursor = db.cursor()

    top_ticker = TopTicker(db, cursor)

    top_ticker.run("2023-01-01", "2023-04-10", 10, "all", "all", "上市")