import pandas as pd
import time
import sys 
import json

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By

options = webdriver.ChromeOptions()
options.add_argument("--disable-notifications")
options.add_argument("headless")
s = Service(ChromeDriverManager().install())
chrome = webdriver.Chrome(options = options,service = s)

chrome.get("https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s"%(sys.argv[1]))

#填充表單_股利政策(發放年度)
s1 = Select(chrome.find_element(by = By.CSS_SELECTOR, value = 'body > table:nth-child(8) > tbody > tr > td:nth-child(3) > table.b1.r10_0 > tbody > tr > td > table > tbody > tr > td:nth-child(1) > nobr:nth-child(1) > select'))
s1.select_by_index(3)
#等待運行時間
time.sleep(2)
#提取表格資料
form = chrome.find_element(by = By.ID, value = 'txtFinDetailData')

df2 = pd.read_html(form.get_attribute('innerHTML'), header = 3)[0]
df2.drop(len(df2) - 1, inplace = True)

for i in range(len(df2)):
    if df2["股利發放年度"][i] == "股利發放年度" or df2["股利發放年度"][i] == "股 利 政 策" or df2["股利發放年度"][i] == "∟":
        df2.drop(i, inplace = True)
        
df2.reset_index(drop = True, inplace = True)
df2 = df2.replace("-", "0")
df2 = df2.drop(df2.columns[8:], axis = 1)

new_name = []
new_name.append("ID")
new_name.extend([str(x) for x in range(1, 8)])
df2 = df2.set_axis(new_name, axis = 1, inplace = False)
js = df2.to_json(orient = 'records')
print(js)
sys.stdout.flush()