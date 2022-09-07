#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import time
import seaborn as sns
import matplotlib.pyplot as plt
import sys
import json

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By


# In[3]:


options = webdriver.ChromeOptions()
options.add_argument("--disable-notifications")
options.add_argument("headless")
s = Service(ChromeDriverManager().install())
chrome = webdriver.Chrome(options = options,service = s)


# In[4]:


chrome.get("https://goodinfo.tw/tw/StockDividendPolicy.asp?STOCK_ID=%s" % (sys.argv[1]))


# In[57]:


yield_form = chrome.find_element(by = By.ID, value = 'divDetail')
df1 = pd.read_html(yield_form.get_attribute('innerHTML'))[0]
df1.drop([x for x in range(16, 20)], inplace = True)
df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)
df1 = df1.loc[:, ('殖 利 率 統 計', '殖 利 率 統 計', '年均殖利率(%)', '合計')].astype(float).fillna(0)


# In[ ]:


result = {
    "NewYield" : round(df1[0], 2),
    "AverageYield" : round(df1[0:10].mean(), 2)
}

json = json.dumps(result)

print(json)
sys.stdout.flush()

