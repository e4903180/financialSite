from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from tqdm import trange
import requests
import os
import sys
import MySQLdb
import MySQLdb.cursors
import pandas as pd
import time
import datetime
import json

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))

class TwseSelenium():
    """Init selenium and get table
    """
    def __init__(self) -> None:
        _options = webdriver.ChromeOptions()
        _options.add_argument('--headless')
        _s = Service(ChromeDriverManager().install())
        
        self.driver = webdriver.Chrome(options = _options, service = _s)

    def get_table(self, year : str, month : str) -> BeautifulSoup:
        """Access twse web site and get table

            Args:
                year : (str) start year
                month : (str) start month
            Return:
                soup : (BeautifulSoup) table data
        """
        self.driver.get("https://mops.twse.com.tw/mops/web/t100sb02_1")
        
        input1 = self.driver.find_element(by = By.NAME, value = "year")
        input1.clear()
        input1.send_keys(year)

        select_element = self.driver.find_element(by = By.NAME, value = "month")
        select_object = Select(select_element)
        select_object.select_by_index(month)
        
        self.driver.find_elements(by = By.XPATH, value = "//input[@type='button']")[1].click()
        time.sleep(3)
        
        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        
        return soup


class MySQL():
    """Connect to MySQL, and define query method
    """
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        
    def isDuplicate(self, key : int, date : str, time : str) -> bool:
        """Check if data duplicate

            Args :
                key : (int) foreign key
                date : (str) data date
                time : (str) data time
            Return:
                bool
        """   
        query = "SELECT * from calender WHERE `ticker_id`='%s' AND `date`='%s' AND `time`='%s';" % (key, date, time)

        self._cursor.execute(query)
        self._db.commit()
        
        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True

    def _get_foreign_key_id(self, stock_num : str) -> int:
        """Find the ticker_list ID

            Args:
                stock_num : (str) stock number
            
            Return:
                If stock_num exist return ID
                else return -1
        """
        query = "SELECT ID FROM ticker_list WHERE stock_num='%s';" % (stock_num)

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return -1
        
        return result["ID"][0]
    
    def insert(self, key : int, Date : str, Time : str, Form : str, Message : str, chPDF : str, enPDF : str, More_information : str, Video_address : str, Attention : str) -> None:
        """Insert data to DB

            Args:
                key : (str) foreign key
                Date : (str) 法說會日期
                Time : (str) 法說會時間
                Form : (str) 舉辦形式
                Message : (str) 資訊
                chPDF : (str) ch pdf filename
                enPDF : (str) en pdf filename
                More_information : (str) 更多資訊
                Video_address : (str) address of live stream
                Attention : (str) 備註
            Return:
                None
        """
        query = ("INSERT INTO calender (`ticker_id`, `date`, `Time`, `Form`, `Message`, `chPDF`, `enPDF`, `More_information`, `Video_address`, `Attention`)"\
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);")
        param = (key, Date, Time, Form, Message, chPDF, enPDF, More_information, Video_address, Attention)

        self._cursor.execute(query, param)
        self._db.commit()
        
    def update(self, key : int, Date : str, Time : str, Form : str, Message : str, chPDF : str, enPDF : str, More_information : str, Video_address : str, Attention : str) -> None:
        """Update data to DB

            Args:
                key : (int) foreign key
                Date : (str) 法說會日期
                Time : (str) 法說會時間
                Form : (str) 舉辦形式
                Message : (str) 資訊
                chPDF : (str) ch pdf filename
                enPDF : (str) en pdf filename
                More_information : (str) 更多資訊
                Video_address : (str) address of live stream
                Attention : (str) 備註
            Return:
                None
        """
        query = ("UPDATE calender SET `Time`=%s, `Form`=%s, `Message`=%s, `chPDF`=%s, `enPDF`=%s, `More_information`=%s, `Video_address`=%s, "\
            "`Attention`=%s WHERE `ticker_id`=%s AND `date`=%s;")
        param = (Time, Form, Message, chPDF, enPDF, More_information, Video_address, Attention, key, Date)

        self._cursor.execute(query, param)
        self._db.commit()


class Twse(TwseSelenium, MySQL):
    """Get data through TwseSelenium class, and update SQL through MySQL class
    """
    def __init__(self):
        TwseSelenium.__init__(self)
        MySQL.__init__(self)
        
    def _download_pdf(self, lang : str, stockNum : str, fileName : str) -> None:
        """Download pdf

            Args :
                lang : (str) language of pdf
                stockNum : (str) stock number
                fileName : (str) filename

            Return:
                None
        """
        # Check if fileName include ".pdf" pattern and file not exists in disk
        if (".pdf" in fileName) and (not os.path.exists(root_path["TWSE_DATA_PATH"] + "/" + lang + "/" + stockNum + "/" + fileName)):
            
            download_payload = {
                "step": "9",
                "filePath": "/home/html/nas/STR/",
                "fileName": fileName,
                "functionName": "t100sb02_1"
            }

            while(True):
                try:
                    download_response = requests.post("https://mops.twse.com.tw/server-java/FileDownLoad",
                                            data = download_payload,
                                            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',"Content-Type": "application/json"}
                                        )

                    data = download_response.content
                except:
                    pass
                
                time.sleep(1)

                # If data lose, length of data lower 1000
                # Instead, break the loop
                if(len(data) > 1000):
                    break

            with open(root_path["TWSE_DATA_PATH"] + "/" + lang + "/" + stockNum + "/" + fileName, 'wb') as s:
                s.write(data)
    
    def run(self, year : str, month : str) -> None:
        """Traverse data and update DB

            Args :
                year : (str) start year
                month : (str) start month
            Return:
                None
        """
        soup = self.get_table(year, month)

        result_even = soup.find_all("tr", class_ = "even")
        result_odd = soup.find_all("tr", class_ = "odd")
        result_total = result_even + result_odd

        # Traverse data
        for i in trange(len(result_total)):
            data_td = result_total[i].find_all("td")
            
            row_date = data_td[2].getText().replace("/", "-")
            newYear = str(int(row_date.split("-")[0]) + 1911)
            row_date = row_date.replace(row_date.split("-")[0], "")
            row_date = newYear + row_date
            
            key = self._get_foreign_key_id(data_td[0].getText().replace("'", ""))

            if key == -1:
                continue

            self._download_pdf("ch", data_td[0].getText(), data_td[6].getText())
            self._download_pdf("en", data_td[0].getText(), data_td[7].getText())

            # Check if data duplicate   
            if not self.isDuplicate(key, row_date, data_td[3].getText().replace("'", "")):
                self.insert(key, row_date, data_td[3].getText().replace("'", ""),
                           data_td[4].getText().replace("'", ""), data_td[5].getText().replace("'", ""), data_td[6].getText().replace("'", ""),
                           data_td[7].getText().replace("'", ""), data_td[8].getText().replace("'", ""), data_td[9].getText().replace("'", ""),
                           data_td[10].getText().replace("'", ""))
                
            else:
                self.update(key, row_date, data_td[3].getText().replace("'", ""),
                           data_td[4].getText().replace("'", ""), data_td[5].getText().replace("'", ""), data_td[6].getText().replace("'", ""),
                           data_td[7].getText().replace("'", ""), data_td[8].getText().replace("'", ""), data_td[9].getText().replace("'", ""),
                           data_td[10].getText().replace("'", ""))

if __name__ == "__main__":
    sys.stderr = open(root_path["TWSE_LOG_PATH"] + "/" + str(datetime.date.today()) + '.log', 'w')
    today = datetime.datetime.now()
    twse = Twse()
    current_year = today.year - 1911

    # 最後檢查上個月資料狀態
    if today.day == 28:
        if today.month == 1:
            twse.run(year = str(current_year - 1), month = "12")
        else:
            twse.run(year = str(current_year), month = str(today.month - 1))

    current_month = today.month
    next_moth = (current_month + 1) % 12

    if next_moth == 0:
        next_moth = 12

    twse.run(year = str(current_year), month = str(current_month))

    # 判斷下個月是否跨年
    if next_moth == 1:
        twse.run(year = str(current_year + 1), month = str(next_moth))
    else:
        twse.run(year = str(current_year), month = str(next_moth))
