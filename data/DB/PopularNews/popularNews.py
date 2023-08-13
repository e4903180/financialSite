import MySQLdb
import MySQLdb.cursors
import json
import pandas as pd
from datetime import datetime, timedelta
from tqdm import trange
from collections import defaultdict
from typing import List, Dict

class PopularNews():
    def __init__(self) -> None:
        db_config = json.load(open("../../../db_config.json"))
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def _init_table(self) -> None:
        query = "TRUNCATE TABLE popular_news"
        self._cursor.execute(query)
        self._db.commit()

    def _insert(self, ticker_id : str, news_id : str, interval : str) -> None:
        query = "INSERT INTO popular_news (ticker_id, news_id, time_interval) VALUES (%s, %s, %s)"
        param = (ticker_id, news_id, interval)

        self._cursor.execute(query, param)
        self._db.commit()

    def _get_news(self, interval : int = 3) -> pd.DataFrame:
        start_date = (datetime.now() - timedelta(days = interval)).strftime("%Y-%m-%d")

        query = "SELECT * FROM news WHERE date>=%s"
        param = (start_date,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return result

    def _get_ticker_list(self) -> pd.DataFrame:
        query = "SELECT ID, stock_name FROM ticker_list WHERE LENGTH(stock_num)=4"

        self._cursor.execute(query,)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        stock_name = result["stock_name"].to_list()
        stock_name = [element[5:] for element in stock_name]

        result["stock_name"] = stock_name

        result = result.sort_values(by = ["stock_name"], ascending = False, key = lambda x: x.str.len())

        return result
    
    def _detect_title_overlap(self, title : str, stock_name : str) -> bool:
        overlap = {
            "冠軍" : ["隱形冠軍"]
        }

        if stock_name not in overlap:
            return False
        
        for text in overlap[stock_name]:
            if text in title:
                return True
        
        return False

    def _detect_stock_name_in_title(self, ticker_list : List, news : List, result : defaultdict(list)) -> Dict:
        for index_ticker_list in range(len(ticker_list)):
            if ticker_list.iloc[index_ticker_list]["stock_name"] not in news["title"]:
                continue

            if self._detect_title_overlap(news["title"], ticker_list.iloc[index_ticker_list]["stock_name"]):
                continue
            
            result[ticker_list.iloc[index_ticker_list]["ID"]].append(news["ID"])
            break
        
        return result

    def _handle_news(self, interval : int, ticker_list : List = [], top : int = 10) -> None:
        result = defaultdict(list)

        news = self._get_news(interval = interval)

        if len(ticker_list) == 0:
            ticker_list = self._get_ticker_list()

        for index_news in trange(len(news)):
            self._detect_stock_name_in_title(ticker_list, news.iloc[index_news], result)

        result = {key : value for key, value in sorted(result.items(), key = lambda item : len(item[1]), reverse = True)}

        for idx, ticker_id in enumerate(result):
            if idx == top:
                break
            
            for news_id in result[ticker_id]:
                self._insert(ticker_id, news_id, interval)

    def run(self):
        self._init_table()
        self._handle_news(interval = 3)
        self._handle_news(interval = 7)
        self._handle_news(interval = 30)

if __name__ == "__main__":
    popular_news = PopularNews()

    popular_news.run()