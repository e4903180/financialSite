import MySQLdb
import MySQLdb.cursors
import json
import pandas as pd
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from tqdm import trange
from collections import defaultdict

class PopularNews():
    def __init__(self) -> None:
        db_config = json.load(open("../../db_config.json"))
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

    def _get_news(self, interval : str = "3days") -> pd.DataFrame:
        if interval == "3days":
            start_date = (datetime.now() - timedelta(days = 3)).strftime("%Y-%m-%d")

        elif interval == "week":
            start_date = (datetime.now() - timedelta(days = 7)).strftime("%Y-%m-%d")

        elif interval == "month":
            start_date = (datetime.now() - relativedelta(months = 1)).strftime("%Y-%m-%d")

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

    def _handle_news(self, interval : str) -> None:
        result = defaultdict(list)

        news = self._get_news(interval = interval)
        ticker_list = self._get_ticker_list()

        for index_news in trange(len(news)):
            for index_ticker_list in range(len(ticker_list)):
                if ticker_list.iloc[index_ticker_list]["stock_name"] in news.iloc[index_news]["title"]:
                    if ticker_list.iloc[index_ticker_list]["stock_name"] == "冠軍":
                        if "隱形冠軍" in news.iloc[index_news]["title"]:
                            continue
                    
                    result[ticker_list.iloc[index_ticker_list]["ID"]].append(news.iloc[index_news]["ID"])
                    break

        result = {key : value for key, value in sorted(result.items(), key = lambda item : len(item[1]), reverse = True)}

        limit = 0
        for ticker_id in result:
            if limit == 10:
                break
            
            for news_id in result[ticker_id]:
                self._insert(ticker_id, news_id, interval)

            limit +=1

    def run(self):
        self._init_table()
        self._handle_news(interval = "3days")
        self._handle_news(interval = "week")
        self._handle_news(interval = "month")

if __name__ == "__main__":
    popular_news = PopularNews()

    popular_news.run()