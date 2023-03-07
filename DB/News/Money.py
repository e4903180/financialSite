from NewsBase import NewsBase
from typing import Any, Dict
import pandas as pd
from tqdm import tqdm
import requests
from bs4 import BeautifulSoup
import sys

class Money(NewsBase):
    """Update news from https://money.udn.com

        Args :
            db : (Any) database connection
            cursor : (Any) database cursor
        Return :
            None
    """

    def __init__(self, db : Any, cursor : Any) -> None:
        super().__init__()

        self._db = db
        self._cursor = cursor

        self._root = "https://money.udn.com/"

    def _get(self, news_setting : Dict, category : str, id : str) -> None:
        """Get the details of news

            Args :
                news : (Dict) news_setting
                category : (str) news category
                id : (str) news category id
            Return :
                None
        """
        page = 1
        duplicate_count = 0
        
        # while loop until duplicate count is 6
        while duplicate_count != 6:
            duplicate_count = 0
            # Insert the page and category id to url
            url = news_setting["url"].format(page, id)
            r = requests.get(url)

            # server response with nothing
            if r.text == "<!--N-->\n  ":
                break

            soup = BeautifulSoup(r.text, "html.parser")
            # Get all news <a> tags
            a_tags = soup.find_all('a')

            # Traverse all <a> tags
            for tag in tqdm(a_tags):
                # Get article attributes title, href, date, repoter
                article_title = tag.get('title')

                # Check if data duplicate in table
                if self._isDuplicate(article_title):
                    duplicate_count += 1
                    continue
                
                # href ex: /money/story/5612/7014949?from=edn_subcatelist_cate
                article_href = self._root + tag.get('href')

                r1 = requests.get(article_href)
                soup1 = BeautifulSoup(r1.text, "html.parser")
                # date ex: 2023/03/07 15:47:51
                article_date = soup1.select_one(".article-body__time").text.split(" ")[0].replace("/", "-")
                # repoter ex: 經濟日報 記者楊伶雯
                article_repoter = soup1.select_one(".article-body__info").text.replace("\n", "").split("／")[0]

                self._insert(article_title, article_href, article_repoter, category, article_date)

            page += 1

    def _insert(self, title : str, link : str, repoter : str, table_category : str, date : str) -> None:
        """Insert article detail to DB

            Args :
                title : (str) article title
                link : (str) article link
                repoter : (str) article repoter
                table_category : (str) category of news for table
                date : (str) date
            Return:
                None
        """
        query = f'INSERT INTO news (`title`, `repoter`, `link`, `date`, `category`) \
            VALUES("{title}", "{repoter}", "{link}", "{date}", "{table_category}")'
        self._cursor.execute(query)
        self._db.commit()

    def _isDuplicate(self, title : str) -> bool:
        """Check if data duplicate

            Args :
                title : (str) article title

            Return:
                bool
        """
        query = f'SELECT * FROM news WHERE title="{title}"'
        
        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True

    def run(self) -> None:
        """Run

            Args :
                None

            Return :
                None 
        """
        # Create news setting dict
        # Contains url, categorys, category id
        news_settings = [
            {
                "url" : "https://money.udn.com/money/get_article/{}/1001/5591/{}",
                "categorys" : ["經濟日報 產業 產業熱點", "經濟日報 產業 科技產業", "經濟日報 產業 綜合產業", "經濟日報 產業 產業達人", "經濟日報 產業 無感5G時代"],
                "ids" : ["5612", "11162", "10871", "6808", "123317"]
            },
            {
                "url" : "https://money.udn.com/money/get_article/{}/1001/5590/{}",
                "categorys" : ["經濟日報 證券 市場焦點", "經濟日報 證券 集中市場", "經濟日報 證券 櫃買動態", "經濟日報 證券 權證特區", "經濟日報 證券 證券達人", "經濟日報 證券 台股擂台"],
                "ids" : ["5607", "5710", "11074", "5739", "8543", "123397"]
            }
        ]

        print("\n經濟日報", file = sys.stderr)
        # Traverse news_settings 
        for news_setting in tqdm(news_settings):
            # Traverse categorys and categorys url id
            for category, id in zip(news_setting["categorys"], news_setting["ids"]):
                print("\n" + category, file = sys.stderr)
                # Get article details
                self._get(news_setting, category, id)