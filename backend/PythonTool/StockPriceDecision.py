#!/usr/bin/env python
# coding: utf-8

# In[1]:

import pandas as pd
import time
import sys 
import json
import twstock

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
lose_val1 = False
lose_val2 = False
lose_val3 = False
lose_val4 = False
lose_val5 = False

try:
    stock_info = twstock.realtime.get(sys.argv[1])
    price_now = round(float(stock_info["realtime"]["latest_trade_price"]), 2)
except:
    lose_val1 = True
    price_now = 0.0

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
    if df2["股利發放年度"][i] == "股利發放年度" or df2["股利發放年度"][i] == "股 利 政 策" or df2["股利發放年度"][i] == "∟":
        df2.drop(i, inplace = True)
df2.reset_index(drop = True, inplace = True)

# In[7]:

#10年歷年股利
dividend = df2["股利合計"][2:int(sys.argv[2])+1]
dividend.reset_index(drop = True, inplace = True)

#10年歷年股價平均
price_high = df1["最高"][2:int(sys.argv[2])+1]
price_high.reset_index(drop = True, inplace = True)
price_low = df1["最低"][2:int(sys.argv[2])+1]
price_low.reset_index(drop = True, inplace = True)
price_avg = df1["平均"][2:int(sys.argv[2])+1]
price_avg.reset_index(drop = True, inplace = True)

#10年歷年EPS
EPS = df1["EPS(元)"][2:int(sys.argv[2])+1]
EPS.reset_index(drop = True, inplace = True)

#10年歷年PER
PER_high = df1["最高PER"][2:int(sys.argv[2])+1]
PER_high.reset_index(drop = True, inplace = True)
PER_low = df1["最低PER"][2:int(sys.argv[2])+1]
PER_low.reset_index(drop = True, inplace = True)
PER_avg = df1["平均PER"][2:int(sys.argv[2])+1]
PER_avg.reset_index(drop = True, inplace = True)

#10年歷年PBR
PBR_high = df1["最高PBR"][2:int(sys.argv[2])+1]
PBR_high.reset_index(drop = True, inplace = True)
PBR_low = df1["最低PBR"][2:int(sys.argv[2])+1]
PBR_low.reset_index(drop = True, inplace = True)
PBR_avg = df1["平均PBR"][2:int(sys.argv[2])+1]
PBR_avg.reset_index(drop = True, inplace = True)

#歷10年年BPS
BPS = df1["BPS(元)"][2:int(sys.argv[2])+1]
BPS_now = df1["BPS(元)"][1]
BPS.reset_index(drop = True, inplace = True)

#股利法
if "-" in dividend.to_list():
    cheap1, reasonable1, expensive1 = [0.0 for i in range(3)]
    lose_val2 = True
else:
    dividend = dividend.astype(float)
    dividend_avg = dividend.mean()
    cheap1 = round(dividend_avg * 16, 2)
    reasonable1 = round(dividend_avg * 20, 2)
    expensive1 = round(dividend_avg * 32, 2)

#高低價法
if ("-" in price_high.to_list()) or ("-" in price_low.to_list()) or ("-" in price_avg.to_list()):
    cheap2, reasonable2, expensive2 = [0.0 for i in range(3)]
    lose_val3 = True
else:
    price_high = price_high.astype(float)
    price_low = price_low.astype(float)
    price_avg = price_avg.astype(float)
    price_high_avg = price_high.mean()
    price_low_avg = price_low.mean()
    price_avg_avg = price_avg.mean()
    cheap2 = round(price_low_avg, 2)
    reasonable2 = round(price_avg_avg, 2)
    expensive2 = round(price_high_avg, 2)

#本淨比法
if (BPS_now == "-") or ("-" in PBR_high.to_list()) or ("-" in PBR_low.to_list()) or ("-" in PBR_avg.to_list()):
    cheap3, reasonable3, expensive3 = [0.0 for i in range(3)]
    lose_val4 = True
else:
    PBR_high = PBR_high.astype(float)
    PBR_low = PBR_low.astype(float)
    PBR_avg = PBR_avg.astype(float)
    BPS_now = float(BPS_now)
    PBR_high_avg = PBR_high.mean()
    PBR_low_avg = PBR_low.mean()
    PBR_avg_avg = PBR_avg.mean()
    cheap3 = round(PBR_low_avg * BPS_now, 2)
    reasonable3 = round(PBR_avg_avg * BPS_now, 2)
    expensive3 = round(PBR_high_avg * BPS_now, 2)

#本益比法
if (EPS[0] == "-") or ("-" in EPS.to_list()) or ("-" in PER_high.to_list()) or ("-" in PER_low.to_list()) or ("-" in PER_avg.to_list()):
    cheap4, reasonable4, expensive4 = [0.0 for i in range(3)]
    lose_val5 = True
else:
    EPS = EPS.astype(float)
    PER_high = PER_high.astype(float)
    PER_low = PER_low.astype(float)
    PER_avg = PER_avg.astype(float)
    EPS_1year = EPS[0]
    EPS_xyear = EPS.mean()
    PER_high_avg = PER_high.mean()
    PER_low_avg = PER_low.mean()
    PER_avg_avg = PER_avg.mean()
    cheap4 = round(PER_low_avg * ((EPS_1year + EPS_xyear) / 2), 2)
    reasonable4 = round(PER_avg_avg * ((EPS_1year + EPS_xyear) / 2), 2)
    expensive4 = round(PER_high_avg * ((EPS_1year + EPS_xyear) / 2), 2)

# In[10]:
dividend_table_name = []
dividend_table_name.append("ID")
dividend_table_name.extend([str(x) for x in range(1, 8)])
dividend_table = df2.drop(df2.columns[8:], axis = 1)
dividend_table.drop(0, inplace = True)
dividend_table.drop(len(dividend_table) - 1, inplace = True)
dividend_table.reset_index(drop = True, inplace = True)
dividend_table = dividend_table.set_axis(dividend_table_name, axis = 1, inplace = False)
dividend_table_json = dividend_table[:int(sys.argv[2])].to_json(orient = 'records')

high_low_table_name = []
high_low_table_name.append("ID")
high_low_table_name.extend([str(x) for x in range(1, 5)])
high_low_table = df1.drop(df1.columns[7:], axis = 1)
high_low_table = high_low_table.drop(high_low_table.columns[1:3], axis = 1)
high_low_table.drop(0, inplace = True)
high_low_table.reset_index(drop = True, inplace = True)
high_low_table = high_low_table.set_axis(high_low_table_name, axis = 1, inplace = False)
high_low_table_json = high_low_table[:int(sys.argv[2])].to_json(orient = 'records')

PER_table_name = []
PER_table_name.append("ID")
PER_table_name.extend([str(x) for x in range(1, 5)])
PER_table = df1.drop(df1.columns[1:9], axis = 1)
PER_table = PER_table.drop(PER_table.columns[5:], axis = 1)
PER_table.drop(0, inplace = True)
PER_table.reset_index(drop = True, inplace = True)
PER_table = PER_table.set_axis(PER_table_name, axis = 1, inplace = False)
PER_table_json = PER_table[:int(sys.argv[2])].to_json(orient = 'records')

PBR_table_name = []
PBR_table_name.append("ID")
PBR_table_name.extend([str(x) for x in range(1, 5)])
PBR_table = df1.drop(df1.columns[1:13], axis = 1)
PBR_table.drop(0, inplace = True)
PBR_table.reset_index(drop = True, inplace = True)
PBR_table = PBR_table.set_axis(PBR_table_name, axis = 1, inplace = False)
PBR_table_json = PBR_table[:int(sys.argv[2])].to_json(orient = 'records')

result = {
    "NewPrice" : price_now,
    "down_cheap" : [],
    "cheap_reasonable" : [],
    "reasonable_expensive" : [],
    "up_expensive" : [],
    "cheap" : [cheap1, cheap2, cheap3, cheap4],
    "reasonable" : [reasonable1, reasonable2, reasonable3, reasonable4],
    "expensive" : [expensive1, expensive2, expensive3, expensive4],
    "Value lose" : [lose_val1, lose_val2, lose_val3, lose_val4, lose_val5]
}

max_value = max(expensive1, expensive2, expensive3, expensive4) * 1.5

if(lose_val2):
    result["down_cheap"].append(0.0)
    result["cheap_reasonable"].append(0.0)
    result["reasonable_expensive"].append(0.0)
    result["up_expensive"].append(0.0)
else:
    result["down_cheap"].append(cheap1)
    result["cheap_reasonable"].append(round(reasonable1 - cheap1, 2))
    result["reasonable_expensive"].append(round(expensive1 - reasonable1, 2))
    result["up_expensive"].append(round(max_value - expensive1, 2))

if(lose_val3):
    result["down_cheap"].append(0.0)
    result["cheap_reasonable"].append(0.0)
    result["reasonable_expensive"].append(0.0)
    result["up_expensive"].append(0.0)
else:
    result["down_cheap"].append(cheap2)
    result["cheap_reasonable"].append(round(reasonable2 - cheap2, 2))
    result["reasonable_expensive"].append(round(expensive2 - reasonable2, 2))
    result["up_expensive"].append(round(max_value - expensive2, 2))

if(lose_val4):
    result["down_cheap"].append(0.0)
    result["cheap_reasonable"].append(0.0)
    result["reasonable_expensive"].append(0.0)
    result["up_expensive"].append(0.0)
else:
    result["down_cheap"].append(cheap3)
    result["cheap_reasonable"].append(round(reasonable3 - cheap3, 2))
    result["reasonable_expensive"].append(round(expensive3 - reasonable3, 2))
    result["up_expensive"].append(round(max_value - expensive3, 2))

if(lose_val5):
    result["down_cheap"].append(0.0)
    result["cheap_reasonable"].append(0.0)
    result["reasonable_expensive"].append(0.0)
    result["up_expensive"].append(0.0)
else:
    result["down_cheap"].append(cheap4)
    result["cheap_reasonable"].append(round(reasonable4 - cheap4, 2))
    result["reasonable_expensive"].append(round(expensive4 - reasonable4, 2))
    result["up_expensive"].append(round(max_value - expensive4, 2))

json1 = json.loads(json.dumps(result))
json1.update({"dividend_table" : { "data" : dividend_table_json }})
json1.update({"high_low_table" : { "data" : high_low_table_json }})
json1.update({"PER_table" : { "data" : PER_table_json }})
json1.update({"PBR_table" : { "data" : PBR_table_json }})
json1 = json.dumps(json1)

chrome.quit()
print(json1)
sys.stdout.flush()