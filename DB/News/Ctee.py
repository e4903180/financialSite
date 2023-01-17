from NewsBase import NewsBase
from selenium import webdriver
from selenium.webdriver.common.by import By
import MySQLdb
import MySQLdb.cursors
import datetime
from typing import Any, Tuple
import pandas as pd
from tqdm import tqdm

class Ctee(NewsBase):
    """Update news from https://ctee.com.tw
    """

    def __init__(self, options : Any, service : Any, db : MySQLdb.connect, cursor : Any) -> None:
        super().__init__()

        self._db = db
        self._cursor = cursor
        
        self.driver = webdriver.Chrome(options = options, service = service)
        self.driver1 = webdriver.Chrome(options = options, service = service)

        self._today = datetime.date.today()
        self._yeasterday = self._today - datetime.timedelta(days = 1)
        self._today_format = self._today.strftime("%Y.%m.%d")
        self._yeasterday_format = self._yeasterday.strftime("%Y.%m.%d")
    
    def run(self):
        """Run

            Args :
                None

            Return :
                None 
        """
        print("工商時報 證券")
        self.crawler("stocks", "工商時報 證券")

        print("工商時報 科技")
        self.crawler("tech", "工商時報 科技")

        print("工商時報 產業")
        self.crawler("industry", "工商時報 產業")

    def crawler(self, category : str, table_category : str) -> None:
        """Crawler different category

            Args :
                category : (str) category of news
                table_category : (str) category of news for table
            Return:
                None
        """
        # first page url
        self.driver.get(f"https://ctee.com.tw/category/news/{category}")

        page = 2
        stop = False

        # Infinite loop until article date is not today
        while True:
            articles = self.driver.find_elements(by = By.TAG_NAME, value = "article")
            
            # traverse articles
            for article in tqdm(articles):
                # Check if acticle date is today date
                if self._check_date(article, self._today_format):
                    self._get_details(article, self._today, table_category)
                elif self._check_date(article, self._yeasterday_format):
                    self._get_details(article, self._yeasterday, table_category)
                else:
                    stop = True
                    break
            
            if stop:
                break

            # after access first page then url change to below format
            self.driver.get(f"https://ctee.com.tw/category/news/{category}/page/{page}")
            page += 1
    
    def _get_details(self, article : Any, date : str, table_category : str):
        """Get the details on article

            Args :
                article : (Any) WebElement of selenium
                date : (str) date
                table_category : (str) category of news for table

            Return :
                None
        """
        title, link = self._find_title_link(article)
        repoter = self._find_repoter(link)

        if not self._isDuplicate(title, link, repoter, table_category):
            self._insert(title, link, repoter, table_category, date)

    def _find_repoter(self, link : str) -> str:
        """Find repoter through article

            Args :
                link : (str) Article link
            Return :
                repoter
        """
        self.driver1.get(link)
        repoter = self.driver1.find_element(by = By.CLASS_NAME, value = "author.url.fn").text

        return repoter

    def _find_title_link(self, article : Any) -> Tuple[str, str]:
        """Find title and link through article

            Args :
                article : (Any) WebElement of selenium
            Return :
                link and text
        """
        h2 = article.find_element(by = By.TAG_NAME, value = "h2")
        a = h2.find_element(by = By.TAG_NAME, value = "a")

        title = h2.text
        link = a.get_attribute('href')

        return title, link

    def _check_date(self, article : Any, date : str) -> bool:
        """Check if date is match

            Args :
                article : (Any) WebElement of selenium
            Return :
                True if acticle date is today date, otherwise False
        """
        article_date = article.find_element(by = By.CLASS_NAME, value = "post-meta").text

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