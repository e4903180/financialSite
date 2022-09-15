import pandas as pd
import time
import seaborn as sns
import matplotlib.pyplot as plt
import sys
import json
from datetime import datetime

from bs4 import BeautifulSoup
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
chrome.get("https://goodinfo.tw/tw/ShowK_Chart.asp?STOCK_ID=%s&CHT_CAT2=%s&PRICE_ADJ=F" % (sys.argv[1], sys.argv[2]))

KLine = chrome.find_element(by = By.ID, value = 'divPriceDetail')
df1 = pd.read_html(KLine.get_attribute('innerHTML'), header = 1)[0]
df1 = df1.drop(df1.columns[[x for x in range(6, len(df1.columns))]], axis = 1)

for i in range(len(df1)):
    if df1["交易月份"][i] == "交易月份":
        df1.drop(i, inplace = True)
    else:
        df1["交易月份"][i] = datetime.strptime(("20" + df1["交易月份"][i]).replace("M", "-"), "%Y-%m").timestamp() * 1000

df1 = df1.drop(df1.columns[1], axis = 1)
df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)
df1 = df1.astype(float)

data = []
for i in range(len(df1) - 1, -1, -1):
    temp = df1.iloc[i].to_list()
    data.append(temp)

result = {
    "data" : data
}

chrome.quit()
json1 = json.dumps(result)

print(json1)
sys.stdout.flush()
