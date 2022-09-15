#!/usr/bin/env python
# coding: utf-8

# In[2]:


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


# In[3]:

options = webdriver.ChromeOptions()
options.add_argument("--disable-notifications")
options.add_argument("headless")
s = Service(ChromeDriverManager().install())
chrome = webdriver.Chrome(options = options,service = s)

# In[31]:

chrome.get("https://goodinfo.tw/tw/ShowK_ChartFlow.asp?RPT_CAT=PER&STOCK_ID=%s&CHT_CAT=%s" % (sys.argv[1], sys.argv[2]))
# In[32]:

PER_River_form = chrome.find_element(by = By.ID, value = 'divDetail')
df1 = pd.read_html(PER_River_form.get_attribute('innerHTML'), header = 1)[0]
df1 = df1.drop(df1.columns[[x for x in range(1, 6)]], axis = 1)


# In[33]:


for i in range(len(df1)):
    if df1["交易月份"][i] == "交易月份":
        df1.drop(i, inplace = True)
    else:
        df1["交易月份"][i] = datetime.strptime(("20" + df1["交易月份"][i]).replace("M", "-"), "%Y-%m").timestamp() * 1000


# In[34]:

df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)
df1 = df1.astype(float)

date = df1[df1.columns[0]].to_list()
date.reverse()

data1 = df1[df1.columns[1]].to_list()
data1.reverse()

data2 = df1[df1.columns[2]].to_list()
data2.reverse()

data3 = df1[df1.columns[3]].to_list()
data3.reverse()

data4 = df1[df1.columns[4]].to_list()
data4.reverse()

data5 = df1[df1.columns[5]].to_list()
data5.reverse()

for i in range(len(date)):
    data1[i] = [date[i], data1[i]]
    data2[i] = [date[i], data2[i]]
    data3[i] = [date[i], data3[i]]
    data4[i] = [date[i], data4[i]]
    data5[i] = [date[i], data5[i]]

# In[36]:

result = {
    "PER_rate" : df1.columns[1:].to_list(),
    "data1" : data1,
    "data2" : data2,
    "data3" : data3,
    "data4" : data4,
    "data5" : data5,
}

json = json.dumps(result)
print(json)
sys.stdout.flush()