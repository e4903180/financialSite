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
df1 = pd.read_html(yield_form.get_attribute('innerHTML'), header = 3)[0]
df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)

for i in range(len(df1)):
    if(df1["股利發放年度"][i] == "股利發放年度" or df1["股利發放年度"][i] == "股 利 政 策"):
        df1.drop(i, inplace = True)
df1.fillna('0')

yield_data = []

for i in range(len(df1)):
    if(df1["股利發放年度"][i] != "∟"):
        yield_data.append(float(df1["合計.2"][i]))

    if(len(yield_data) == 10):
        break

# In[ ]:

result = {
    "NewYield" : round(yield_data[0], 2),
    "AverageYield" : round(sum(yield_data) / 10, 2)
}

json = json.dumps(result)

print(json)
sys.stdout.flush()

