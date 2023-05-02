import pandas as pd
import time
from tqdm import tqdm
from typing import Dict, List
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import MySQLdb
import MySQLdb.cursors
import json
import sys
import datetime
import os

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService

class TickerUpdate():
    def __init__(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-notifications")
        options.add_argument("--start-maximized")
        options.add_argument("headless")
        s = Service(ChromeDriverManager().install())
        self._chrome = webdriver.Chrome(options = options, service = s)

        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def _get_category(self, url : str) -> List:
        """Get the category

            Args :
                url : (str) url
                
            Return :
                bool
        """
        category = []

        self._chrome.get(url)
        td_text = self._chrome.find_elements(by = By.TAG_NAME, value = "td")[3].text

        ticker_row = td_text.split("\n")

        ticker_row[0] = ticker_row[0].replace("上市 ", "")
        ticker_row[0] = ticker_row[0].replace(" 上櫃", "")
        
        # remove space char
        ptr = len(ticker_row[-1]) - 1

        while ticker_row[-1][ptr] == " ":
            ptr -= 1

        ticker_row[-1] = ticker_row[-1][:ptr + 1]
        
        # split categorys to category
        for row in ticker_row:
            cols = row.split(" ")

            category.extend(cols)

        return category

    def _isDuplicate(self, stock_name : str) -> bool:
        """Check if duplicate

            Args :
                stock_name : (str) stock name
                
            Return :
                bool
        """
        query = f'SELECT * FROM ticker_list WHERE stock_name="{stock_name}"'
        
        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return False if result.empty else True
    
    def _insert(self, stock_num : str, stock_name : str, category : str) -> None:
        """Insert into DB

            Args :
                stock_num : (str) stock num
                stock_name : (str) stock name
                category : (str) category
                
            Return :
                None
        """
        query = f'INSERT INTO ticker_list (`stock_num`, `stock_name`, `class`) \
            VALUES("{stock_num}", "{stock_name}", "{category}")'
        
        self._cursor.execute(query)
        self._db.commit()

    def _update(self, categorys : List, type : str) -> None:
        """Update new ticker

            Args :
                categorys : (List) list of category
                type : (str) 上市或上櫃

            Return :
                None
        """
        for category in tqdm(categorys):
            self._chrome.get(f"https://tw.stock.yahoo.com/h/kimosel.php?tse={type}&cat={category}&form=menu&form_id=stock_id&form_name=stock_name&domain=0")
            tables_tag = self._chrome.find_elements(by = By.TAG_NAME, value = "table")[6]
            a_tags = tables_tag.find_elements(by = By.TAG_NAME, value = "a")

            print(category)
            for a_tag in tqdm(a_tags):
                if self._isDuplicate(a_tag.text):
                    continue

                self._insert(a_tag.text.split(" ")[0], a_tag.text, category)

            time.sleep(0.5)

    def run(self) -> None:
        """Run

            Args :
                None
            Return :
                None
        """
        # 上市 上櫃url
        handle_urls = {
            "1" :"https://tw.stock.yahoo.com/h/kimosel.php?tse=1&cat=%A5b%BE%C9%C5%E9&form=menu&form_id=stock_id&form_name=stock_name&domain=0",
            "2" : "https://tw.stock.yahoo.com/h/kimosel.php?tse=2&cat=%C2d%A5b%BE%C9&form=menu&form_id=stock_id&form_name=stock_name&domain=0"
        }

        for key in handle_urls:
            # 產業類別
            categorys = self._get_category(handle_urls[key])

            # 更新每個產業類別
            self._update(categorys, key)


class UpdateLocal():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self._investment_company_chinese = ["元富", "統一投顧", "CTBC", "國票投顧", "台新投顧", "富邦", "元大",
                                            "第一金", "兆豐", "永豐投顧", "宏遠", "康和", "群益", "國泰", "MS",
                                            "玉山投顧", "福邦", "GS", "Daiwa", "HSBC", "瑞信", "摩根大通", "citi",
                                            "NMR", "麥格理", "NMR", "ubs", "凱基", "合庫", "jpm", "大和國泰",
                                            "KGI", "capital", "里昂", "一銀", "HTI", "MR", "dw", "野村",
                                            "華南", "高盛"]
        self._dir_paths = [root_path["GMAIL_DATA_DATA_PATH"], root_path["TWSEDATA_CH"], root_path["TWSEDATA_EN"]]

    def _get_ticker_list(self) -> pd.DataFrame:
        query = 'SELECT stock_name FROM ticker_list'

        self._cursor.execute(query)
        self._db.commit()

        return pd.DataFrame.from_dict(self._cursor.fetchall())
    
    def _update_local(self) -> None:
        result = self._get_ticker_list()

        stock_num = []
        stock_name = []

        for i in tqdm(result["stock_name"].to_list()):
            temp = i.split(" ")
            stock_num.append(temp[0])
            stock_name.append(temp[1])

            for dir_path in self._dir_paths:
                if not os.path.isdir(f"{dir_path}/{temp[0]}"):
                    os.mkdir(f"{dir_path}/{temp[0]}")

        with pd.ExcelWriter(f"{root_path['TICKER_LIST_DIR_PATH']}/24932_個股代號及券商名稱.xlsx") as writer:
            pd.DataFrame({"股票代號" : stock_num, "股票名稱" : stock_name}).to_excel(writer, 
                                                                            sheet_name = '股票代號', index = False)
            pd.DataFrame({"中文名稱" : self._investment_company_chinese}).to_excel(writer, 
                                                                            sheet_name = '券商名稱', index = False)
    
    def run(self) -> None:
        self._update_local()

if __name__ == "__main__":
    log_path = f"{root_path['TICKER_UPDATE_LOG_PATH']}/{str(datetime.datetime.now())}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    TLU = TickerUpdate()
    UL = UpdateLocal()
    
    try:
        TLU.run()
        UL.run()
    except:
        log_notify_service.send_email("股票清單更新狀態", log_path)