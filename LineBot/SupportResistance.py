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
    _df = None
    _df1 = None

    def __init__(self) -> None:
        pass

    def get_data(self, stock_num : str, start_date : str, ma_type : str, ma_len : int) -> None:
        self._maLen = ma_len

        self._df = yf.download(stock_num + ".TWO", start = start_date, progress = False, show_errors = False)

        if self._df.empty:
            self._df = yf.download(stock_num + ".TW", start = start_date, progress = False, show_errors = False)

        self._df = self._df.reset_index()
        self._df = self._df.drop(columns = ["Adj Close"])
        self._df["Open"] = self._df["Open"].round(2)
        self._df["High"] = self._df["High"].round(2)
        self._df["Low"] = self._df["Low"].round(2)
        self._df["Close"] = self._df["Close"].round(2)

        self._df1 = self._df
        self._df1["Date"] = self._df1["Date"].astype(str)
        self._df1 = self._df1.rename(columns = {'Date': 'ID'})
        self._table_data = self._df1.to_json(orient = "records")

        self._df["Date"] = pd.to_datetime(self._df["Date"]).astype(int)
        self._df["Date"] = self._df["Date"].replace(self._df["Date"].to_list(), [i / 10**6 for i in self._df["Date"].tolist()])
        self._df = self._df.astype(float)

        self._volume = self._df[["Date", "Volume"]].values.tolist()

        if ma_type == "wma":
            self._ma = talib.WMA(self._df["Close"], timeperiod = ma_len)
        elif ma_type == "sma":
            self._ma = talib.SMA(self._df["Close"], timeperiod = ma_len)

    def method1(self) -> json:
        pos_BIAS = []
        neg_BIAS = []
        support = []
        resistance = []
        ma_o = []

        for i in range(self._maLen, len(self._ma), 1):
            temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
            
            if temp >= 0:
                pos_BIAS.append(round(float(temp), 4))
            else:
                neg_BIAS.append(round(float(temp), 4))

        pos_BIAS.sort()
        neg_BIAS.sort()

        pos_BIAS_val = float(pos_BIAS[int(len(pos_BIAS) * 0.95) - 1])
        neg_BIAS_val = float(neg_BIAS[int(len(neg_BIAS) * 0.05) - 1])

        for i in range(self._maLen, len(self._ma), 1):
            support.append([self._df["Date"][i], round((1 + neg_BIAS_val) * self._ma[i], 2)])
            ma_o.append([self._df["Date"][i], round(self._ma[i], 2)])
            resistance.append([self._df["Date"][i], round((1 + pos_BIAS_val) * self._ma[i], 2)])

        self._df = self._df.drop(columns = ["Volume"])

        result = {
            "support" : support,
            "resistance" : resistance,
            "Kline" : self._df.values.tolist(),
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
            if self._df["Close"][i] < self._ma[i]:
                temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        neg_BIAS_std = np.std(neg_BIAS)

        for i in range(self._maLen, len(self._ma), 1):
            temp = self._ma[i] * (1 + (np.mean(neg_BIAS) - 2 * neg_BIAS_std))
            support.append([self._df["Date"][i], round(temp, 2)])
            ma_o.append([self._df["Date"][i], round(self._ma[i], 2)])

        result = {
            "support" : support,
            "resistance" : [],
            "Kline" : self._df.values.tolist(),
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
        over_volume = 0

        vol_avg = self._df["Volume"][len(self._df) - 2 - self._maLen - 1: len(self._df) - 2].sum() / self._maLen

        if self._df["Volume"][len(self._df) - 1] > 2 * vol_avg:
            over_volume = 1
        else:
            over_volume = 0

        for i in range(self._maLen, len(self._ma), 1):
            if self._df["Close"][i] < self._ma[i]:
                temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        neg_BIAS.sort()
        neg_BIAS_1 = neg_BIAS[int(len(neg_BIAS) * 0.01) - 1]
        neg_BIAS_5 = neg_BIAS[int(len(neg_BIAS) * 0.05) - 1]

        for i in range(self._maLen, len(self._ma), 1):
            support1.append([self._df["Date"][i], round(self._ma[i] + self._ma[i] * neg_BIAS_1, 2)])
            support2.append([self._df["Date"][i], round(self._ma[i] + self._ma[i] * neg_BIAS_5, 2)])
            ma_o.append([self._df["Date"][i], round(self._ma[i], 2)])

        result = {
            "support1" : support1,
            "support2" : support2,
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "over" : over_volume
        }

        json1 = json.loads(json.dumps(result))
        json1.update({"table_data" : { "data" : self._table_data }})
        json1 = json.dumps(json1)

        return json1
        
if __name__ == "__main__":
    object = SupportResistance()
    
    object.get_data(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]))

    if sys.argv[5] == "method1":
        print(object.method1())
        sys.stdout.flush()

    elif sys.argv[5] == "method2":
        print(object.method2())
        sys.stdout.flush()

    elif sys.argv[5] == "method3":
        print(object.method3())
        sys.stdout.flush()