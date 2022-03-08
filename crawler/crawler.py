# %%
import requests
from bs4 import BeautifulSoup
import os
import pandas as pd
from tqdm import trange
import time as tm
import logging
from datetime import datetime

# %%
class Crawler:
    def __init__(self, year, month, path, co_id = " "):
        self.year = str(year - 1911)
        self.month = str(month).zfill(2)
        self.path = path
        self.co_id = co_id
    
    def start(self, display = False):
        Id, name, date, time, place, message, ch_file, en_file, more_information, video_address, attention = [[] for x in range(11)]
        rootPath = self.path
        
        dic_name = datetime.now().strftime("%Y_%m_%d")

        # Create log file
        FORMAT = '%(asctime)s %(levelname)s: %(message)s'
        logging.basicConfig(level = logging.INFO, filename = rootPath + 'crawler_' + dic_name + '.log', filemode = 'w', format = FORMAT)
        logging.info('Updating data start')
        
        # Initialize params
        payload = {
            # 上市 / 未上市
            "encodeURIComponent": "1",
            "step": "1",
            "firstin": "1",
            "off": "1",
            "TYPEK": "sii",
            # 年度
            "year": self.year,
            # 月份
            "month": self.month,
            # 公司代號
            "co_id": self.co_id
        }
        
        # get the response data through post method and params
        response = requests.post("https://mops.twse.com.tw/mops/web/t100sb02_1"
                                 , data = payload)

        soup = BeautifulSoup(response.text, "html.parser")
        
        if(display):
            print("Result: ")
            print(soup.prettify())
        
        result_even = soup.find_all("tr", class_ = "even")
        result_odd = soup.find_all("tr", class_ = "odd")
        result_total = result_even + result_odd
        
        for i in trange(len(result_total)):
            data_td = result_total[i].find_all("td")
            logging.info('Download schedule: ' + str(i + 1) + " / " + str(len(result_total)))
            
            for ptr in range(len(data_td)):
                if ptr == 0:
                    Id.append(data_td[ptr].getText())
                elif ptr == 1:
                    name.append(data_td[ptr].getText())
                elif ptr == 2:
                    date.append(data_td[ptr].getText())
                elif ptr == 3:
                    time.append(data_td[ptr].getText())
                elif ptr == 4:
                    temp = data_td[ptr].getText()
                    temp = temp.replace("/r", "")
                    temp = temp.replace("/n", "")

                    place.append(temp)
                elif ptr == 5:
                    temp = data_td[ptr].getText()
                    temp = temp.replace("/r", "")
                    temp = temp.replace("/n", "")

                    message.append(temp)
                elif ptr == 6:
                    temp = data_td[ptr].getText()
                    
                    if ".pdf" in temp:
                        download_payload = {
                            "step": "9",
                            "filePath": "/home/html/nas/STR/",
                            "fileName": str(temp),
                            "functionName": "t100sb02_1"
                        }
                        
                        while(True):
                            try:
                                download_response = requests.post("https://mops.twse.com.tw/server-java/FileDownLoad"
                                                     , data = download_payload)
                            except:
                                logging.error('Ch file download error')
                        
                            data = download_response.content
                            tm.sleep(1)
                            
                            if(len(data) != 496):
                                break
                        
                        if not os.path.isdir(rootPath + "file"):
                            os.mkdir(rootPath + "file")
                            
                        if not os.path.isdir(rootPath + "file/" + dic_name):
                                os.mkdir(rootPath + "file/" + dic_name)
                            
                        if not os.path.isdir(rootPath + "file/" + dic_name + "/ch"):
                            os.mkdir(rootPath + "file/" + dic_name + "/ch")
                        
                        with open(rootPath + "file/" + dic_name + "/ch/" + Id[-1] + "_" + temp, 'wb') as s:
                            s.write(data)
                            
                        ch_file.append(Id[-1] + "_" + temp)
                    else:
                        ch_file.append("null")
                elif ptr == 7:
                    temp = data_td[ptr].getText()
                    
                    if ".pdf" in temp:
                        download_payload = {
                            "step": "9",
                            "filePath": "/home/html/nas/STR/",
                            "fileName": str(temp),
                            "functionName": "t100sb02_1"
                        }
                        
                        while(True):
                            try:
                                download_response = requests.post("https://mops.twse.com.tw/server-java/FileDownLoad"
                                                     , data = download_payload)
                            except:
                                logging.error('En file download error')
                        
                            data = download_response.content
                            tm.sleep(1)
                            
                            if(len(data) != 496):
                                break
                        
                        if not os.path.isdir(rootPath + "file"):
                            os.mkdir(rootPath + "file")
                            
                        if not os.path.isdir(rootPath + "file/" + dic_name):
                            os.mkdir(rootPath + "file/" + dic_name)
                            
                        if not os.path.isdir(rootPath + "file/" + dic_name + "/en"):
                            os.mkdir(rootPath + "file/" + dic_name + "/en")
                        
                        with open(rootPath + "file/" + dic_name + "/en/" + Id[-1] + "_" + temp, 'wb') as s:
                            s.write(data)
                            
                        en_file.append(Id[-1] + "_" + temp)
                    else:
                        en_file.append("null")
                elif ptr == 8:
                    more_information.append(data_td[ptr].getText())
                elif ptr == 9:
                    temp = data_td[ptr].getText()
                    temp = temp.replace("\r", "")
                    temp = temp.replace("\n", "")
                    temp = temp.replace(".", " ")
                    
                    video_address.append(temp)
                elif ptr == 10:
                    attention.append(data_td[ptr].getText())
        
        df = pd.DataFrame({"Co_ID" : Id, "Co_name" : name, "Date" : date, "Time" : time, "Form" : place, "Message" : message
                          , "CH_file" : ch_file, "EN_file" : en_file, "More information" : more_information, "Video address" : video_address, "Attention" : attention})
        df.to_csv(self.path + dic_name + ".csv", index = False)

        logging.info('Updating data completed')
        
        return df


