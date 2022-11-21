#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd
import sys
import json
import twstock
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
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

try :
    PER_River_form = chrome.find_element(by = By.ID, value = 'divDetail')
except Exception:
    result = {
        "error" : "Error"
    }

    json = json.dumps(result)
    print(json)
    sys.stdout.flush()
    sys.exit()

df1 = pd.read_html(PER_River_form.get_attribute('innerHTML'), header = 1)[0]
EPS = float(df1[df1.columns[4]][0])
df1 = df1.drop(df1.columns[[x for x in range(1, 6)]], axis = 1)

# In[33]:

for i in range(len(df1)):
    if df1["交易月份"][i] == "交易月份":
        df1.drop(i, inplace = True)
    else:
        df1["交易月份"][i] = ("20" + df1["交易月份"][i]).replace("M", "-") + "-01"

df1["交易月份"] = [i / 10**6 for i in pd.to_datetime(df1["交易月份"]).astype(int)]
# In[34]:
df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)

df1 = df1.astype(float)

data1, data2, data3, data4, data5, data6 = [[] for i in range(6)]

for i in range(len(df1) - 1, -1, -1):
    data1.append([df1[df1.columns[0]][i], df1[df1.columns[1]][i]])
    data2.append([df1[df1.columns[0]][i], df1[df1.columns[2]][i]])
    data3.append([df1[df1.columns[0]][i], df1[df1.columns[3]][i]])
    data4.append([df1[df1.columns[0]][i], df1[df1.columns[4]][i]])
    data5.append([df1[df1.columns[0]][i], df1[df1.columns[5]][i]])
    data6.append([df1[df1.columns[0]][i], df1[df1.columns[6]][i]])

PER_rate_col = df1.columns[1:].to_list()
# In[36]:
chrome.get("https://goodinfo.tw/tw/ShowK_Chart.asp?STOCK_ID=%s&CHT_CAT2=%s&PRICE_ADJ=F" % (sys.argv[1], sys.argv[2]))

try :
    KLine = chrome.find_element(by = By.ID, value = 'divPriceDetail')
except:
    result = {
        "error" : "Error"
    }

    json = json.dumps(result)
    print(json)
    sys.stdout.flush()
    sys.exit()

df1 = pd.read_html(KLine.get_attribute('innerHTML'), header = 1)[0]
df1 = df1.drop(df1.columns[[x for x in range(6, len(df1.columns))]], axis = 1)

for i in range(len(df1)):
    if df1["交易月份"][i] == "交易月份":
        df1.drop(i, inplace = True)
    else:
        df1["交易月份"][i] = ("20" + df1["交易月份"][i]).replace("M", "-") + "-01"

df1["交易月份"] = [i / 10**6 for i in pd.to_datetime(df1["交易月份"]).astype(int)]

df1 = df1.drop(df1.columns[1], axis = 1)
df1.reset_index(drop = True, inplace = True)
df1.replace("-", 0, inplace = True)
df1 = df1.astype(float)

kline = df1.values.tolist()
kline.reverse()

realtime_price = float(twstock.realtime.get(sys.argv[1])["realtime"]["latest_trade_price"])

cheap = round(EPS * float(PER_rate_col[0][0:-1]), 2)
reasonable = round(EPS * ((float(PER_rate_col[2][0:-1]) + float(PER_rate_col[3][0:-1])) / 2), 2)
expensive = round(EPS * float(PER_rate_col[5][0:-1]), 2)

if realtime_price <= cheap:
    evaluate = "評價: 目前價格(" + str(realtime_price) + ") < 便宜價(" + str(cheap) + ")"
elif (realtime_price > cheap) and (realtime_price <= reasonable):
    evaluate = "評價: 便宜價(" + str(cheap) + ")" + "< 目前價格(" + str(realtime_price) + ") < 合理價(" + str(reasonable) + ")"
elif (realtime_price > reasonable) and (realtime_price <= expensive):
    evaluate = "評價: 合理價(" + str(reasonable) + ")" + "< 目前價格(" + str(realtime_price) + ") < 昂貴價(" + str(expensive) + ")"
else:
    evaluate = "評價: 目前價格(" + str(realtime_price) + ") > 昂貴價(" + str(expensive) + ")"

result = {
    "NewPrice" : realtime_price,
    "PER_rate" : PER_rate_col,
    "EPS" : EPS,
    "Kline" : kline,
    "data1" : data1,
    "data2" : data2,
    "data3" : data3,
    "data4" : data4,
    "data5" : data5,
    "data6" : data6,
    "cheap" : cheap,
    "evaluate" : evaluate,
    "reasonable" : reasonable,
    "expensive" : expensive,
    "down_cheap" : [cheap],
    "cheap_reasonable" : [round(reasonable - cheap, 2)],
    "reasonable_expensive" : [round(expensive - reasonable, 2)],
    "up_expensive" : [round(expensive * 1.5 - expensive, 2)]
}

json1 = json.dumps(result)

print(json1)

sys.stdout.flush()