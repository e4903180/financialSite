from Ctee import Ctee
from MoneyDj import MoneyDj
from Money import Money
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import MySQLdb
import MySQLdb.cursors
import sys
import datetime
    
class News():
    def __init__(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        service = Service(ChromeDriverManager().install())

        db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint",
                    passwd = "CEMj8ptYHraxNxFt", db = "financial", charset = "utf8",
                    cursorclass = MySQLdb.cursors.DictCursor)
        cursor = db.cursor()

        self._ctee = Ctee(options, service, db, cursor)
        self._moneydj = MoneyDj(options, service, db, cursor)
        self._money = Money(options, service, db, cursor)
    
    def run(self):
        self._ctee.run()
        self._moneydj.run()
        self._money.run()

if __name__ == "__main__":
    sys.stderr = open("/home/cosbi/桌面/financialData/news/" + str(datetime.datetime.now()) + '.log', 'w')
    news = News()

    news.run()