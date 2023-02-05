from NewsBase import NewsBase
from selenium import webdriver
from selenium.webdriver.common.by import By
from typing import Any
import pandas as pd
from tqdm import tqdm
import requests
from bs4 import BeautifulSoup
import sys

class MoneyDj(NewsBase):
    """Update news from https://www.moneydj.com

        Args :
            options : (Any) selenium potions
            service : (Any) selenium service
            db : (Any) database connection
            cursor : (Any) database cursor
        Return :
            None
    """

    def __init__(self, options : Any, service : Any, db : Any, cursor : Any) -> None:
        super().__init__()

        self._db = db
        self._cursor = cursor
        self.driver = webdriver.Chrome(options = options, service = service)
    
    def run(self):
        """Run

            Args :
                None

            Return :
                None 
        """
        self.driver.get("https://www.moneydj.com")
        
        ul = self.driver.find_element(by = By.ID, value = "djMenuBar2")
        industry_li = ul.find_elements(by = By.XPATH, value = "./li")[6]
        industry_li = industry_li.find_element(by = By.TAG_NAME, value = "ul")
        industry_li = industry_li.find_elements(by = By.XPATH, value = "./li")

        table_category = "MoneyDj 科技"
        print("\nMoneyDj", file = sys.stderr)

        for i in range(2):
            print("\n" + table_category, file = sys.stderr)
            aes = industry_li[i].find_elements(by = By.TAG_NAME, value = "a")

            for a in tqdm(aes):
                title = a.get_attribute("innerText")

                # Check if data duplicate in table
                if self._isDuplicate(title):
                    continue

                link = a.get_attribute("href")
                r = requests.get(link)
                soup = BeautifulSoup(r.text, "html.parser")
                repoter = soup.select_one('p').text
                date = soup.find("span", {"id" : "MainContent_Contents_lbDate"}).text.split(" ")[0].replace("/", "-")

                if repoter[-2:] != "報導" :
                    repoter = "NULL"
                else:
                    start = -4

                    while repoter[start] != "記":
                        start -= 1
                    repoter = repoter[start : -3]
                
                self._insert(title, link, repoter, table_category, date)

            table_category = "MoneyDj 傳產"
    
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
        query = "INSERT INTO news (`title`, `repoter`, `link`, `date`, `category`) \
            VALUES(%s, %s, %s, %s, %s)"
        param = (title, repoter, link, date, table_category)

        self._cursor.execute(query, param)
        self._db.commit()

    def _isDuplicate(self, title : str) -> bool:
        """Check if data duplicate

            Args :
                title : (str) article title
            Return:
                bool
        """
        query = "SELECT * FROM news WHERE title=%s"
        param = (title,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True