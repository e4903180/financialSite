import pandas as pd
import sys
import twstock
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from typing import Dict

class PerRiver():
    def __init__(self) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument("--disable-notifications")
        options.add_argument("headless")
        s = Service(ChromeDriverManager().install())
        self.chrome = webdriver.Chrome(options = options, service = s)

        self.data = {"data1" : [], "data2" : [], "data3" : [], "data4" : [], "data5" : [], "data6" : []}
        self.PER_rate_col = None
        self.EPS = 0.0
        self.realtime_price = 0.0

        self.kline = None

        self.evaluate = {"evaluate" : "", "cheap" : 0.0, "reasonable" : 0.0, "expensive" : 0.0}

    def _get_realtime_price(self, ticker : str) -> None:
        stock_info = twstock.realtime.get(ticker)
        bid = int(stock_info["realtime"]["best_bid_price"][-1])
        ask = int(stock_info["realtime"]["best_ask_price"][-1])

        price = (bid + ask) / 2
        self.realtime_price = round(price, 2)

    def _get_EPS(self, ticker : str, period : str) -> None:
        self.chrome.get("https://goodinfo.tw/tw/ShowK_ChartFlow.asp?RPT_CAT=PER&STOCK_ID=%s&CHT_CAT=%s" % (ticker, period))

        PER_River_form = self.chrome.find_element(by = By.ID, value = 'divDetail')

        PER_table = pd.read_html(PER_River_form.get_attribute('innerHTML'), header = 1)[0]
        self.EPS = float(PER_table[PER_table.columns[4]][0])
        PER_table = PER_table.drop(PER_table.columns[[x for x in range(1, 6)]], axis = 1)

        for i in range(len(PER_table)):
            if PER_table["交易月份"][i] == "交易月份":
                PER_table.drop(i, inplace = True)
            else:
                PER_table["交易月份"][i] = ("20" + PER_table["交易月份"][i]).replace("M", "-") + "-01"

        PER_table["交易月份"] = [i / 10**6 for i in pd.to_datetime(PER_table["交易月份"]).astype(int)]
        PER_table.reset_index(drop = True, inplace = True)
        PER_table.replace("-", 0, inplace = True)
        PER_table = PER_table.astype(float)

        for i in range(len(PER_table) - 1, -1, -1):
            for idx, key in enumerate(self.data.keys()):
                self.data[key].append([PER_table[PER_table.columns[0]][i], PER_table[PER_table.columns[idx + 1]][i]])

        self.PER_rate_col = PER_table.columns[1:].to_list()

    def _get_Kline(self, ticker : str, period : str) -> None:
        self.chrome.get("https://goodinfo.tw/tw/ShowK_Chart.asp?STOCK_ID=%s&CHT_CAT2=%s&PRICE_ADJ=F" % (ticker, period))

        KLine = self.chrome.find_element(by = By.ID, value = 'divPriceDetail')

        Kline_table = pd.read_html(KLine.get_attribute('innerHTML'), header = 1)[0]
        Kline_table = Kline_table.drop(Kline_table.columns[[x for x in range(6, len(Kline_table.columns))]], axis = 1)
        Kline_table = Kline_table.iloc[:-1]

        for i in range(len(Kline_table)):
            if Kline_table["交易月份"][i] == "交易月份":
                Kline_table.drop(i, inplace = True)
            else:
                Kline_table["交易月份"][i] = ("20" + Kline_table["交易月份"][i]).replace("M", "-") + "-01"

        Kline_table["交易月份"] = [i / 10**6 for i in pd.to_datetime(Kline_table["交易月份"]).astype(int)]

        Kline_table = Kline_table.drop(Kline_table.columns[1], axis = 1)
        Kline_table.reset_index(drop = True, inplace = True)
        Kline_table.replace("-", 0, inplace = True)
        Kline_table = Kline_table.astype(float)

        self.kline = Kline_table.values.tolist()
        self.kline.reverse()

    def _get_evaluate(self):
        self.evaluate["cheap"] = round(self.EPS * float(self.PER_rate_col[0][0:-1]), 2)
        self.evaluate["reasonable"] = round(self.EPS * ((float(self.PER_rate_col[2][0:-1]) + float(self.PER_rate_col[3][0:-1])) / 2), 2)
        self.evaluate["expensive"] = round(self.EPS * float(self.PER_rate_col[5][0:-1]), 2)

        if self.realtime_price <= self.evaluate["cheap"]:
            self.evaluate["evaluate"] = "評價: 目前價格(" + str(self.realtime_price) + ") < 便宜價(" + str(self.evaluate["cheap"]) + ")"
        
        elif ((self.realtime_price > self.evaluate["cheap"]) and
                (self.realtime_price <= self.evaluate["reasonable"])):
            self.evaluate["evaluate"] = "評價: 便宜價(" + str(self.evaluate["cheap"]) + ")" + "< 目前價格(" + str(self.realtime_price) + ") < 合理價("+ str(self.evaluate["reasonable"]) + ")"
        
        elif ((self.realtime_price > self.evaluate["reasonable"]) and
                (self.realtime_price <= self.evaluate["expensive"])):
            self.evaluate["evaluate"] = "評價: 合理價(" + str(self.evaluate["reasonable"]) + ")" + "< 目前價格(" + str(self.realtime_price) + ") < 昂貴價(" + str(self.evaluate["expensive"]) + ")"
        
        else:
            self.evaluate["evaluate"] = "評價: 目前價格(" + str(self.realtime_price) + ") > 昂貴價(" + str(self.evaluate["expensive"]) + ")"

    def run(self, ticker : str, period : str) -> Dict:
        self._get_realtime_price(ticker)
        self._get_EPS(ticker, period)
        self._get_Kline(ticker, period)
        self._get_evaluate()
        
        result = {
            "NewPrice" : self.realtime_price,
            "PER_rate" : self.PER_rate_col,
            "EPS" : self.EPS,
            "Kline" : self.kline,
            "data1" : self.data["data1"],
            "data2" : self.data["data2"],
            "data3" : self.data["data3"],
            "data4" : self.data["data4"],
            "data5" : self.data["data5"],
            "data6" : self.data["data6"],
            "cheap" : self.evaluate["cheap"],
            "reasonable" : self.evaluate["reasonable"],
            "expensive" : self.evaluate["expensive"],
            "evaluate" : self.evaluate["evaluate"],
            "down_cheap" : [self.evaluate["cheap"]],
            "cheap_reasonable" : [round(self.evaluate["reasonable"] - self.evaluate["cheap"], 2)],
            "reasonable_expensive" : [round(self.evaluate["expensive"] - self.evaluate["reasonable"], 2)],
            "up_expensive" : [round(self.evaluate["expensive"] * 1.5 - self.evaluate["expensive"], 2)]
        }

        return result

if __name__ == "__main__":
    per = PerRiver()
    print(per.run("2330", "MONTH"))