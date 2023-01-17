from NewsBase import NewsBase
from selenium import webdriver
from selenium.webdriver.common.by import By
import MySQLdb
import MySQLdb.cursors
import datetime
from typing import Any, Dict
import pandas as pd
from tqdm import tqdm
import requests
from bs4 import BeautifulSoup

class Money(NewsBase):
    """Update news from https://money.udn.com
    """

    def __init__(self, options : Any, service : Any, db : MySQLdb.connect, cursor : Any) -> None:
        super().__init__()

        self._db = db
        self._cursor = cursor
        
        self.driver = webdriver.Chrome(options = options, service = service)
        self.driver1 = webdriver.Chrome(options = options, service = service)

        self._today = datetime.date.today()
        self._yeasterday = self._today - datetime.timedelta(days = 1)
        self._today_format = self._today.strftime("%Y/%m/%d")
        self._yeasterday_format = self._yeasterday.strftime("%Y/%m/%d")
        self._root = "https://money.udn.com/"

    def _get_details(self, news_setting : Dict, category : str, id : str) -> None:
        """Get the details of news

            Args :
                news : (Dict) news_setting
                category : (str) news category
                id : (str) news category id
            Return :
                None
        """
        page = 1
        stop = False

        # Infinite loop until article date is not today or yeasterday
        while True:
            # Insert the page and category id to url
            url = news_setting["url"].format(page, id)
            r = requests.get(url)
            soup = BeautifulSoup(r.text, "html.parser")
            # Get all news <a> tags
            a_tags = soup.find_all('a')

            # Traverse all <a> tags
            for tag in tqdm(a_tags):
                # Get article attributes title, href, date, repoter
                article_title = tag.get('title')
                article_href = self._root + tag.get('href')

                r1 = requests.get(article_href)
                soup1 = BeautifulSoup(r1.text, "html.parser")
                article_date = soup1.select_one(".article-body__time").text.split(" ")[0]
                article_repoter = soup1.select_one(".article-body__info").text.replace("\n", "").split("／")[0]

                # Check if data duplicate in table
                if self._isDuplicate(article_title, article_href, article_repoter, category):
                    continue

                # Check if article date is today
                if self._check_date(article_date, self._today_format):
                    self._insert(article_title, article_href, article_repoter, category, self._today_format)
                # Check if article date is yeasterday
                elif self._check_date(article_date, self._yeasterday_format):
                    self._insert(article_title, article_href, article_repoter, category, self._yeasterday_format)
                # Raise stop flag
                else:
                    stop = True

            if stop:
                break

            page += 1

    def _check_date(self, article_date : str, date : str) -> bool:
        """Check if article date match date

            Args :
                article_date : (str) article date
                date : (str) date
            Return :
                None
        """
        if article_date == date:
            return True
        return False

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

    def _isDuplicate(self, title : str, link : str, repoter : str, table_category : str) -> bool:
        """Check if data duplicate

            Args :
                title : (str) article title
                link : (str) article link
                repoter : (str) article repoter
                table_category : (str) category of news for table
            Return:
                bool
        """
        query = f'SELECT * FROM news WHERE title="{title}" \
            AND link="{link}" AND repoter="{repoter}" AND category="{table_category}"'

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True

    def run(self):
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
                "categorys" : ["經濟日報 產業 產業熱點", "經濟日報 產業 科技產業", "經濟日報 產業 綜合產業", "經濟日報 產業 產業達人"],
                "ids" : ["5612", "11162", "10871", "6808"]
            },
            {
                "url" : "https://money.udn.com/money/get_article/{}/1001/5590/{}",
                "categorys" : ["經濟日報 證券 市場焦點", "經濟日報 證券 集中市場", "經濟日報 證券 櫃買動態", "經濟日報 證券 權證特區", "經濟日報 證券 證券達人"],
                "ids" : ["5607", "5710", "11074", "5739", "8543"]
            }
        ]

        # Traverse news_settings 
        for news_setting in tqdm(news_settings):
            # Traverse categorys and categorys url id
            for category, id in zip(news_setting["categorys"], news_setting["ids"]):
                print(category)
                # Get article details
                self._get_details(news_setting, category, id)

                