#!/usr/bin/env python
# coding: utf-8

# In[2]:


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
        df1["交易月份"][i] = ("20" + df1["交易月份"][i]).replace("M", ".")


# In[34]:


df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)


# In[36]:


result = {
    "date" : df1.iloc[:, 0].to_list(),
    df1.keys()[1] : df1.iloc[:, 1].astype(float).to_list(),
    df1.keys()[2] : df1.iloc[:, 2].astype(float).to_list(),
    df1.keys()[3] : df1.iloc[:, 3].astype(float).to_list(),
    df1.keys()[4] : df1.iloc[:, 4].astype(float).to_list(),
    df1.keys()[5] : df1.iloc[:, 5].astype(float).to_list(),
}


# In[39]:


json = json.dumps(result)
print(json)
sys.stdout.flush()


# In[ ]:




