from Ctee import Ctee
from MoneyDj import MoneyDj
from Money import Money
from StatementDog import StatementDog
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import MySQLdb
import MySQLdb.cursors
import sys
import datetime
import json

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService
    
class NewsDayUpdate():
    """Update news from some websites
    """
    
    def __init__(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        service = Service(ChromeDriverManager().install())

        db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        cursor = db.cursor()

        self._ctee = Ctee(options, service, db, cursor)
        self._moneydj = MoneyDj(options, service, db, cursor)
        self._money = Money(db, cursor)
        self._statementdog = StatementDog(db, cursor)
    
    def run(self) -> None:
        """Run

            Args :
                None

            Return :
                None 
        """
        self._moneydj.run()
        self._money.run()
        self._statementdog.run()
        self._ctee.run()

if __name__ == "__main__":
    temp = str(datetime.datetime.now())
    log_path = f"{root_path['NEWS_LOG_PATH']}/{temp}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    news = NewsDayUpdate()

    try:
        news.run()
    except Exception as e:
        log_notify_service.send_email("新聞更新狀態", str(e))