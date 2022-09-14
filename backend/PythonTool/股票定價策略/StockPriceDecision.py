#!/usr/bin/env python
# coding: utf-8

# In[1]:

import pandas as pd
import time
import sys 
import json

#使用selenium套件爬蟲
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By

# In[2]:

# In[3]:


options = webdriver.ChromeOptions()
options.add_argument("--disable-notifications")
options.add_argument("headless")
s = Service(ChromeDriverManager().install())
chrome = webdriver.Chrome(options = options,service = s)


# In[4]:

chrome.get("https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s"%(sys.argv[1]))

#現在價格
now_price = chrome.find_element(by = By.CSS_SELECTOR, value = '#divDetail > table > tbody > tr:nth-child(3) > td:nth-child(4) > nobr > a')
price_now = float(now_price.text)

#填充表單_PER/PBR
s1 = Select(chrome.find_element(by = By.CSS_SELECTOR, value = 'body > table:nth-child(8) > tbody > tr > td:nth-child(3) > table.b1.r10_0 > tbody > tr > td > table > tbody > tr > td:nth-child(1) > nobr:nth-child(1) > select'))
s1.select_by_index(2)
#等待運行時間

time.sleep(2)
#提取表格資料
form = chrome.find_element(by = By.ID, value = 'txtFinDetailData')
df1 = pd.read_html(form.get_attribute('innerHTML'), header = 1)[0]

for i in range(len(df1)):
    if df1["年度"][i] == "年度":
        df1.drop(i, inplace = True)
df1.reset_index(drop = True, inplace = True)

#填充表單_股利政策(發放年度)
s1 = Select(chrome.find_element(by = By.CSS_SELECTOR, value = 'body > table:nth-child(8) > tbody > tr > td:nth-child(3) > table.b1.r10_0 > tbody > tr > td > table > tbody > tr > td:nth-child(1) > nobr:nth-child(1) > select'))
s1.select_by_index(3)
#等待運行時間
time.sleep(2)
#提取表格資料
form = chrome.find_element(by = By.ID, value = 'txtFinDetailData')

df2 = pd.read_html(form.get_attribute('innerHTML'), header = 3)[0]
for i in range(len(df2)):
    if df2["股利發放年度"][i] == "股利發放年度" or df2["股利發放年度"][i] == "股 利 政 策":
        df2.drop(i, inplace = True)
df2.reset_index(drop = True, inplace = True)

# In[5]:


# In[6]:


# 定義參數名稱

# In[7]:


#10年歷年股利
dividend = []
ptr = -1
for i in range(len(df2)):
    if(df2["股利合計"][i] == "-"):
        df2["股利合計"][i] = "0"

    if df2["股利發放年度"][i] != '∟':
        dividend.append(float(df2["股利合計"][i]))
        ptr += 1
    else:
        dividend[ptr] += float(df2["股利合計"][i])

#10年歷年股價平均
price_high = df1["最高"][1:12]

price_high.reset_index(drop = True, inplace = True)
price_high.replace("-", "0", inplace = True)
price_high = price_high.astype(float, errors = 'raise')

price_low = df1["最低"][1:12]
price_low.reset_index(drop = True, inplace = True)
price_low.replace("-", "0", inplace = True)
price_low = price_low.astype(float, errors = 'raise')

price_avg = df1["平均"][1:12]
price_avg.reset_index(drop = True, inplace = True)
price_avg.replace("-", "0", inplace = True)
price_avg = price_avg.astype(float, errors = 'raise')

#10年歷年EPS
EPS = df1["EPS(元)"][1:12]
EPS.reset_index(drop = True, inplace = True)
EPS.replace("-", "0", inplace = True)
EPS = EPS.astype(float, errors = 'raise')

#10年歷年PER
PER_high = df1["最高PER"][1:12]
PER_high.reset_index(drop = True, inplace = True)
PER_high.replace("-", "0", inplace = True)
PER_high = PER_high.astype(float, errors = 'raise')

PER_low = df1["最低PER"][1:12]
PER_low.reset_index(drop = True, inplace = True)
PER_low.replace("-", "0", inplace = True)
PER_low = PER_low.astype(float, errors = 'raise')

PER_avg = df1["平均PER"][1:12]
PER_avg.reset_index(drop = True, inplace = True)
PER_avg.replace("-", "0", inplace = True)
PER_avg = PER_avg.astype(float, errors = 'raise')

#10年歷年PBR
PBR_high = df1["最高PBR"][1:12]
PBR_high.reset_index(drop = True, inplace = True)
PBR_high.replace("-", "0", inplace = True)
PBR_high = PBR_high.astype(float, errors = 'raise')

PBR_low = df1["最低PBR"][1:12]
PBR_low.reset_index(drop=True, inplace = True)
PBR_low.replace("-", "0", inplace = True)
PBR_low = PBR_low.astype(float, errors = 'raise')

PBR_avg = df1["平均PBR"][1:12]
PBR_avg.reset_index(drop = True, inplace = True)
PBR_avg.replace("-", "0", inplace = True)
PBR_avg = PBR_avg.astype(float, errors = 'raise')

#歷10年年BPS
BPS = df1["BPS(元)"][1:12]
BPS.reset_index(drop = True, inplace = True)
BPS.replace("-", "0", inplace = True)
BPS = BPS.astype(float, errors = 'raise')

# In[8]:

# In[9]:


#股利法
dividend_avg = sum(dividend[1:int(sys.argv[2])+1]) / int(sys.argv[2])
cheap1= dividend_avg * 16
reasonable1 = dividend_avg * 20
expensive1 = dividend_avg * 32

#高低價法
price_high_avg = price_high [1:int(sys.argv[2])+1].mean()
price_low_avg = price_low [1:int(sys.argv[2])+1].mean()
price_avg_avg = price_avg [1:int(sys.argv[2])+1].mean()
cheap2 = price_low_avg
reasonable2 = price_avg_avg
expensive2 = price_high_avg

#本淨比法
BPS_now = BPS[0]
PBR_high_avg = PBR_high [1:int(sys.argv[2])+1].mean()
PBR_low_avg = PBR_low [1:int(sys.argv[2])+1].mean()
PBR_avg_avg = PBR_avg [1:int(sys.argv[2])+1].mean()
cheap3 = PBR_low_avg * BPS[0]
reasonable3 = PBR_avg_avg * BPS[0]
expensive3 = PBR_high_avg * BPS[0]

#本益比法
EPS_1year = EPS[1]
EPS_xyear = EPS [1:int(sys.argv[2]) + 1].mean()
PER_high_avg = PER_high [1:int(sys.argv[2]) + 1].mean()
PER_low_avg = PER_low [1:int(sys.argv[2]) + 1].mean()
PER_avg_avg = PER_avg [1:int(sys.argv[2]) + 1].mean()
cheap4 = PER_low_avg * ((EPS_1year + EPS_xyear) / 2)
reasonable4 = PER_avg_avg * ((EPS_1year + EPS_xyear) / 2)
expensive4 = PER_high_avg * ((EPS_1year + EPS_xyear) / 2)

# In[10]:

result = {
    "NewPrice" : str(round(price_now, 2)),
    "cheap1" : str(round(cheap1, 2)),
    "reasonable1" : str(round(reasonable1, 2)),
    "expensive1" : str(round(expensive1, 2)),
    "cheap2" : str(round(cheap2, 2)),
    "reasonable2" : str(round(reasonable2, 2)),
    "expensive2" : str(round(expensive2, 2)),
    "cheap3" : str(round(cheap3, 2)),
    "reasonable3" : str(round(reasonable3, 2)),
    "expensive3" : str(round(expensive3, 2)),
    "cheap4" : str(round(cheap4, 2)),
    "reasonable4" : str(round(reasonable4, 2)),
    "expensive4" : str(round(expensive4, 2)),
}

json = json.dumps(result)

print(json)
sys.stdout.flush()

# In[16]:


# In[15]:


# In[ ]:




