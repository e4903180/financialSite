import json
import MySQLdb
import MySQLdb.cursors
import pandas as pd
from typing import Dict, List

root_path = json.load(open("../../../root_path.json"))
recommend_json = json.load(open("../../../recommend.json"))

class TwseFinancialData:
    """Find the twse and financialData
    """
    def __init__(self, db : MySQLdb, cursor) -> None:
        self._db = db
        self._cursor = cursor

        self._buy_pattern = recommend_json["buy"]

        self._hold_pattern = recommend_json["hold"]

        self._sell_pattern = recommend_json["sell"]

        self._interval_pattern = recommend_json["interval"]
    
    def _get_twse(self, start_date : str, end_date : str) -> pd.DataFrame:
        """Get the data from twse

            Args :
                start_date : (str) start date
                end_date : (str) end date

            Return :
                result : (pd.DataFrame) result of query 
        """
        query = f"SELECT calender.*, ticker_list.stock_num, ticker_list.stock_name, ticker_list.class\
                from calender INNER JOIN ticker_list ON calender.ticker_id=ticker_list.ID WHERE 1=1 \
                AND calender.date BETWEEN %s AND %s ORDER BY ticker_list.stock_num ASC, calender.date ASC"
        param = (start_date, end_date)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return result

        return result
    
    def _get_financialData(self, start_date : str, end_date : str, stock_list : List) -> pd.DataFrame:
        """Get the data from financialData

            Args :
                start_date : (str) start date
                end_date : (str) end date

            Return :
                result : (pd.DataFrame) result of query 
        """
        query = f"SELECT financialData.*, ticker_list.stock_name, ticker_list.stock_num \
            FROM financialData INNER JOIN ticker_list ON financialData.ticker_id=ticker_list.ID \
            WHERE ticker_list.stock_num IN %s AND date BETWEEN %s AND %s ORDER BY ticker_list.stock_num ASC,\
            date ASC"
        param = (tuple(stock_list), start_date, end_date)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return result
            
        return result
    
    def _recommend_distribution(self, recommends : List) -> Dict:
        """Calculate recommend distribution

            Args :
                recommends : (List) recommends list

            Return :
                Dict
        """
        recommend_distribution = {
            "buy" : 0,
            "sell" : 0,
            "hold" : 0,
            "interval" : 0
        }

        for recommend in recommends:
            if recommend in self._buy_pattern:
                recommend_distribution["buy"] += 1

            elif recommend in self._hold_pattern:
                recommend_distribution["hold"] += 1
            
            elif recommend in self._sell_pattern:
                recommend_distribution["sell"] += 1

            elif recommend in self._interval_pattern:
                recommend_distribution["interval"] += 1
        
        return recommend_distribution
    
    def _calculate(self, twse : pd.DataFrame, financialData : pd.DataFrame, stock_name : List) -> List:
        """Calculate result

            Args :
                twse : (pd.DataFrame) twse data
                financialData : (pd.DataFrame) financialData
                stock_name : (List) twse unique stock name

            Return :
                List
        """
        result = []

        for idx, stock in enumerate(stock_name):
            distribution_result = self._recommend_distribution(
                    financialData[financialData["stock_name"] == stock]["recommend"].to_list())
            
            temp = {
                "ID" : idx,
                "stock_name" : stock,
                "twse" : twse[twse["stock_name"] == stock].to_dict(orient = "records"),
                "financialData" : financialData[financialData["stock_name"] == stock].to_dict(orient = "records"),
            }

            # combine two dict
            result.append(temp | distribution_result)
        
        return result

    def run(self, start_date_twse : str, end_date_twse : str, start_date_research : str, end_date_research : str) -> List:
        """Run

            Args :
                start_date_twse : (str) twse start date
                end_date_twse : (str) twse end date
                start_date_research : (str) research start date
                end_date_research : (str) research end date
            
            Return :
                List
        """
        twse = self._get_twse(start_date_twse, end_date_twse)
        
        if twse.empty:
            return []
        
        financialData = self._get_financialData(start_date_research, end_date_research, twse["stock_num"])

        if financialData.empty:
            return []

        twse = twse[twse["stock_num"].isin(financialData["stock_num"])]

        return self._calculate(twse, financialData, twse["stock_name"].unique())

if __name__ == "__main__":
    db_config = json.load(open("../../../../../../db_config.json"))

    db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
    cursor = db.cursor()

    top_ticker = TwseFinancialData(db, cursor)

    top_ticker.run("2023-07-01", "2023-07-18")