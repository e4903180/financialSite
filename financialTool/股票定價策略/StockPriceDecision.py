#!/usr/bin/env python
# coding: utf-8

# In[1]:

import pandas as pd
import time
import argparse
import sys 
import json

#使用selenium套件爬蟲
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By

parser = argparse.ArgumentParser()
parser.add_argument("StockNum", type = str)
parser.add_argument("Year", type = int)
args = parser.parse_args()

# In[2]:

# In[3]:


options = webdriver.ChromeOptions()
options.add_argument("--disable-notifications")
options.add_argument("headless")
s = Service(ChromeDriverManager().install())
chrome = webdriver.Chrome(options = options,service = s)


# In[4]:

chrome.get("https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s"%(args.StockNum))

#現在價格
now_price = chrome.find_element(by = By.CSS_SELECTOR, value = '#divDetail > table > tbody > tr:nth-child(3) > td:nth-child(4) > nobr > a')
# print('目前價格:'+ now_price.text)
# print('\n')
price_now = float(now_price.text)

#填充表單_PER/PBR
s1 = Select(chrome.find_element(by = By.CSS_SELECTOR, value = 'body > table:nth-child(8) > tbody > tr > td:nth-child(3) > table.b1.r10_0 > tbody > tr > td > table > tbody > tr > td:nth-child(1) > nobr:nth-child(1) > select'))
s1.select_by_index(2)
#等待運行時間

time.sleep(2)
#提取表格資料
form = chrome.find_element(by = By.ID, value = 'txtFinDetailData')
df1 = pd.read_html(form.get_attribute('innerHTML'))[0]
df1.drop([18, 19], inplace = True)
df1.reset_index(drop = True, inplace = True)

#填充表單_股利政策(發放年度)
s1 = Select(chrome.find_element(by = By.CSS_SELECTOR, value = 'body > table:nth-child(8) > tbody > tr > td:nth-child(3) > table.b1.r10_0 > tbody > tr > td > table > tbody > tr > td:nth-child(1) > nobr:nth-child(1) > select'))
s1.select_by_index(3) 
#等待運行時間
time.sleep(2)
#提取表格資料
form = chrome.find_element(by = By.ID, value = 'txtFinDetailData')

df2 = pd.read_html(form.get_attribute('innerHTML'), header = 3)[0]
df2.reset_index(drop = True, inplace = True)
df2.drop([16, 17, 18, 19], inplace = True)


# In[5]:


# In[6]:


# 定義參數名稱

# In[7]:


#10年歷年股利 
dividend = df2["股利合計"][1:12]
dividend.reset_index(drop = True, inplace = True)
dividend = dividend.astype(float, errors = 'raise')

#10年歷年股價平均
price_high = df1.loc[1:12, ('年度股價(元)', '最高')]
price_high.reset_index(drop = True, inplace = True)
price_high = price_high.astype(float, errors = 'raise')

price_low = df1.loc[1:12, ('年度股價(元)', '最低')]
price_low.reset_index(drop = True, inplace = True)
price_low = price_low.astype(float, errors = 'raise')

price_avg = df1.loc[1:12, ('年度股價(元)', '平均')]
price_avg.reset_index(drop = True, inplace = True)
price_avg = price_avg.astype(float, errors = 'raise')

#10年歷年EPS
EPS = df1.loc[1:12, ('本益比(PER)統計', 'EPS(元)')]
EPS.reset_index(drop = True, inplace = True)
EPS = EPS.astype(float, errors = 'raise')

#10年歷年PER
PER_high = df1.loc[1:12, ('本益比(PER)統計',  '最高PER')]
PER_high.reset_index(drop = True, inplace = True)
PER_high = PER_high.astype(float, errors = 'raise')

PER_low = df1.loc[1:12, ('本益比(PER)統計',  '最低PER')]
PER_low.reset_index(drop = True, inplace = True)
PER_low = PER_low.astype(float, errors = 'raise')

PER_avg = df1.loc[1:12, ('本益比(PER)統計',  '平均PER')]
PER_avg.reset_index(drop = True, inplace = True)
PER_avg = PER_avg.astype(float, errors = 'raise')

#10年歷年PBR
PBR_high = df1.loc[1:12, ('本淨比(PBR)統計',  '最高PBR')]
PBR_high.reset_index(drop = True, inplace = True)
PBR_high = PBR_high.astype(float, errors = 'raise')

PBR_low = df1.loc[1:12, ('本淨比(PBR)統計',  '最低PBR')]
PBR_low.reset_index(drop=True, inplace = True)
PBR_low = PBR_low.astype(float, errors = 'raise')

PBR_avg = df1.loc[1:12, ('本淨比(PBR)統計',  '平均PBR')]
PBR_avg.reset_index(drop = True, inplace = True)
PBR_avg = PBR_avg.astype(float, errors = 'raise')

#歷10年年BPS
BPS = df1.loc[1:12, ('本淨比(PBR)統計', 'BPS(元)')]
BPS.reset_index(drop = True, inplace = True)
BPS = BPS.astype(float, errors = 'raise')

# In[8]:

# In[9]:


#股利法
dividend_avg = dividend[1:int(args.Year)+1].mean()
cheep1= dividend_avg *16
reasonable1 = dividend_avg * 20
expensive1 = dividend_avg * 32

#高低價法
price_high_avg = price_high [1:int(args.Year)+1].mean()
price_low_avg = price_low [1:int(args.Year)+1].mean()
price_avg_avg = price_avg [1:int(args.Year)+1].mean()
cheep2 = price_low_avg
reasonable2 = price_avg_avg
expensive2 = price_high_avg

#本淨比法
BPS_now = BPS[0]
PBR_high_avg = PBR_high [1:int(args.Year)+1].mean()
PBR_low_avg = PBR_low [1:int(args.Year)+1].mean()
PBR_avg_avg = PBR_avg [1:int(args.Year)+1].mean()
cheep3 = PBR_low_avg * BPS[0]
reasonable3 = PBR_avg_avg * BPS[0]
expensive3 = PBR_high_avg * BPS[0]

#本益比法
EPS_1year = EPS[1]
EPS_xyear = EPS [1:int(args.Year) + 1].mean()
PER_high_avg = PER_high [1:int(args.Year) + 1].mean()
PER_low_avg = PER_low [1:int(args.Year) + 1].mean()
PER_avg_avg = PER_avg [1:int(args.Year) + 1].mean()
cheep4 = PER_low_avg * ((EPS_1year + EPS_xyear) / 2)
reasonable4 = PER_avg_avg * ((EPS_1year + EPS_xyear) / 2)
expensive4 = PER_high_avg * ((EPS_1year + EPS_xyear) / 2)

# In[10]:

result = {
    "NewPrice" : str(price_now),
    "cheep1" : str(round(cheep1, 2)),
    "reasonable1" : str(round(reasonable1, 2)),
    "expensive1" : str(round(expensive1, 2)),
    "cheep2" : str(round(cheep2, 2)),
    "reasonable2" : str(round(reasonable2, 2)),
    "expensive2" : str(round(expensive2, 2)),
    "cheep3" : str(round(cheep3, 2)),
    "reasonable3" : str(round(reasonable3, 2)),
    "expensive3" : str(round(expensive3, 2)),
}

json = json.dumps(result)

print(json)
sys.stdout.flush()

# In[16]:


# In[15]:


# In[ ]:




