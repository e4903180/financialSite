import pandas as pd
import sys
import json
import talib
import numpy as np
import yfinance as yf

class SupportResistance():
    _ma = []
    _volume = []
    _table_data = None
    _maLen = 0

    def __init__(self, stock_num : str, start_date : str, ma_type : str, ma_len : int) -> None:
        self._maLen = ma_len

        self.df = yf.download(stock_num + ".TWO", start = start_date, progress = False, show_errors = False)

        if self.df.empty:
            self.df = yf.download(stock_num + ".TW", start = start_date, progress = False, show_errors = False)

        self.df = self.df.reset_index()
        self.df = self.df.drop(columns = ["Adj Close"])
        self.df["Open"] = self.df["Open"].round(2)
        self.df["High"] = self.df["High"].round(2)
        self.df["Low"] = self.df["Low"].round(2)
        self.df["Close"] = self.df["Close"].round(2)

        self.df1 = self.df
        self.df1["Date"] = self.df1["Date"].astype(str)
        self.df1 = self.df1.rename(columns = {'Date': 'ID'})
        self._table_data = self.df1.to_json(orient = "records")

        self.df["Date"] = pd.to_datetime(self.df["Date"]).astype(int)
        self.df["Date"] = self.df["Date"].replace(self.df["Date"].to_list(), [i / 10**6 for i in self.df["Date"].tolist()])
        self.df = self.df.astype(float)

        self._volume = self.df[["Date", "Volume"]].values.tolist()

        if ma_type == "wma":
            self._ma = talib.WMA(self.df["Close"], timeperiod = ma_len)
        elif ma_type == "sma":
            self._ma = talib.SMA(self.df["Close"], timeperiod = ma_len)

    def method1(self) -> json:
        pos_BIAS = []
        neg_BIAS = []
        support = []
        resistance = []
        ma_o = []

        for i in range(self._maLen, len(self._ma), 1):
            temp = (float(self.df["Close"][i]) - self._ma[i]) / self._ma[i]
            
            if temp >= 0:
                pos_BIAS.append(round(float(temp), 4))
            else:
                neg_BIAS.append(round(float(temp), 4))

        pos_BIAS.sort()
        neg_BIAS.sort()

        pos_BIAS_val = float(pos_BIAS[int(len(pos_BIAS) * 0.95) - 1])
        neg_BIAS_val = float(neg_BIAS[int(len(neg_BIAS) * 0.05) - 1])

        for i in range(self._maLen, len(self._ma), 1):
            support.append([self.df["Date"][i], round((1 + neg_BIAS_val) * self._ma[i], 2)])
            ma_o.append([self.df["Date"][i], round(self._ma[i], 2)])
            resistance.append([self.df["Date"][i], round((1 + pos_BIAS_val) * self._ma[i], 2)])

        self.df = self.df.drop(columns = ["Volume"])

        result = {
            "support" : support,
            "resistance" : resistance,
            "Kline" : self.df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o
        }

        json1 = json.loads(json.dumps(result))
        json1.update({"table_data" : { "data" : self._table_data }})
        json1 = json.dumps(json1)

        return json1

    def method2(self) -> json:
        neg_BIAS = []
        support = []
        ma_o = []

        for i in range(self._maLen, len(self._ma), 1):
            if self.df["Close"][i] < self._ma[i]:
                temp = (float(self.df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        neg_BIAS_std = np.std(neg_BIAS)

        for i in range(self._maLen, len(self._ma), 1):
            temp = self._ma[i] * (1 + (np.mean(neg_BIAS) - 2 * neg_BIAS_std))
            support.append([self.df["Date"][i], round(temp, 2)])
            ma_o.append([self.df["Date"][i], round(self._ma[i], 2)])

        result = {
            "support" : support,
            "resistance" : [],
            "Kline" : self.df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o
        }

        json1 = json.loads(json.dumps(result))
        json1.update({"table_data" : { "data" : self._table_data }})
        json1 = json.dumps(json1)

        return json1
    
    def method3(self) -> json:
        neg_BIAS = []
        ma_o = []
        support1 = []
        support2 = []
        over_volume = ""

        vol_avg = self.df["Volume"][len(self.df) - 2 - self._maLen - 1: len(self.df) - 2].sum() / self._maLen

        if self.df["Volume"][len(self.df) - 1] > 2 * vol_avg:
            over_volume = "今日交易量超過" + str(self._maLen) + "天均量"
        else:
            over_volume = "今日交易量未超過" + str(self._maLen) + "天均量"

        for i in range(self._maLen, len(self._ma), 1):
            if self.df["Close"][i] < self._ma[i]:
                temp = (float(self.df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        neg_BIAS.sort()
        neg_BIAS_1 = neg_BIAS[int(len(neg_BIAS) * 0.01) - 1]
        neg_BIAS_5 = neg_BIAS[int(len(neg_BIAS) * 0.05) - 1]

        for i in range(self._maLen, len(self._ma), 1):
            support1.append([self.df["Date"][i], round(self._ma[i] + self._ma[i] * neg_BIAS_1, 2)])
            support2.append([self.df["Date"][i], round(self._ma[i] + self._ma[i] * neg_BIAS_5, 2)])
            ma_o.append([self.df["Date"][i], round(self._ma[i], 2)])

        result = {
            "support1" : support1,
            "support2" : support2,
            "Kline" : self.df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "over" : over_volume
        }

        json1 = json.loads(json.dumps(result))
        json1.update({"table_data" : { "data" : self._table_data }})
        json1 = json.dumps(json1)

        return json1

if __name__ == "__main__":
    object = SupportResistance(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]))
    
    if sys.argv[5] == "method1":
        print(object.method1())
        sys.stdout.flush()

    elif sys.argv[5] == "method2":
        print(object.method2())
        sys.stdout.flush()

    elif sys.argv[5] == "method3":
        print(object.method3())
        sys.stdout.flush()