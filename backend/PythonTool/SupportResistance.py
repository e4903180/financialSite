import pandas as pd
import sys
import json
import talib
import numpy as np
import yfinance as yf
import MySQLdb
import pandas as pd
from datetime import datetime

class SupportResistance():
    def __init__(self, stock_num : str, start_date : str, ma_type : str, ma_len : int, method : str) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint",
                    passwd = "CEMj8ptYHraxNxFt", db = "financial", charset = "utf8")
        self._cursor = self._db.cursor()

        self._ma, self._volume = [[] for i in range(2)]
        self._table_data = None
        self._df = None

        self._ma_len = ma_len
        self._stock_num = stock_num
        self._start_date = start_date
        self._ma_type = ma_type
        self._method = method

    def isExist(self) -> bool:
        self._cursor.execute('SELECT count(*) AS count FROM support_resistance WHERE `ticker`=%s AND `ma_type`=%s AND `ma_len`=%s AND `start_date`=%s', (
            self._stock_num,
            self._ma_type,
            self._ma_len,
            self._start_date
        ))

        if self._cursor.fetchall()[0][0] != 0: return True
        else: return False

    def insert_new_data_to_db(self, new_data: dict) -> None:
        self._cursor.execute("INSERT INTO support_resistance (`ticker`, `ma_type`, `ma_len`, `start_date`, `method`, `Kline`, `volume`, `pos_BIAS`, `neg_BIAS`, `ma_line`, `annotations_labels`, `support`, `resistance`)"
                                " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (
                                    self._stock_num,
                                    self._ma_type,
                                    self._ma_len,
                                    self._start_date,
                                    self._method,
                                    json.dumps(new_data["Kline"]),
                                    json.dumps(new_data["volume"]),
                                    json.dumps(new_data["pos_BIAS"]),
                                    json.dumps(new_data["neg_BIAS"]),
                                    json.dumps(new_data["ma"]),
                                    json.dumps(new_data["annotations_labels"]),
                                    json.dumps(new_data["support"]),
                                    json.dumps(new_data["resistance"])
                                )
        )
        self._db.commit()
    
    def get_data_yfinance(self) -> None:
        self._df = yf.download(self._stock_num + ".TWO", start = self._start_date, progress = False, show_errors = False)

        if self._df.empty:
            self._df = yf.download(self._stock_num + ".TW", start = self._start_date, progress = False, show_errors = False)

        self._df = self._df.reset_index().drop(columns = ["Adj Close"])
        self._df["Open"] = self._df["Open"].round(2)
        self._df["High"] = self._df["High"].round(2)
        self._df["Low"] = self._df["Low"].round(2)
        self._df["Close"] = self._df["Close"].round(2)
        self._df= self._df.fillna(0.0)

        self._table_data = self._df.rename(columns = {'Date': 'ID'})
        self._table_data["ID"] = self._table_data["ID"].astype(str)
        self._table_data = self._table_data.to_json(orient = "records")

        self._df["Date"] = [i / 10**6 for i in pd.to_datetime(self._df["Date"]).astype(int)]
        self._df = self._df.astype(float)

        self._volume = self._df[["Date", "Volume"]].values.tolist()

        if self._ma_type == "wma":
            self._ma = talib.WMA(self._df["Close"], timeperiod = self._ma_len)
        elif self._ma_type == "sma":
            self._ma = talib.SMA(self._df["Close"], timeperiod = self._ma_len)

    def get_data_db(self) -> json:
        self._cursor.execute('SELECT Kline, volume, ma_line, annotations_labels, support, resistance FROM support_resistance WHERE `ticker`=%s AND `ma_type`=%s AND `ma_len`=%s AND `start_date`=%s', (
            self._stock_num,
            self._ma_type,
            self._ma_len,
            self._start_date
        ))

        result = self._cursor.fetchall()
        Kline_table = pd.read_json(result[0][0]).rename(columns = {0: 'ID', 1 : 'Open', 2 : 'High', 3 : 'Low', 4 : 'Close'})

        for row in range(len(Kline_table["ID"])): Kline_table["ID"][row] = datetime.fromtimestamp(Kline_table["ID"][row] / 10 ** 3).strftime('%Y-%m-%d')

        json1 = json.loads(json.dumps({
            "Kline" : json.loads(result[0][0]),
            "volume" : json.loads(result[0][1]),
            "ma" : json.loads(result[0][2]),
            "annotations_labels" : json.loads(result[0][3]),
            "support" : json.loads(result[0][4]),
            "resistance" : json.loads(result[0][5]),
        }))

        json1.update({"table_data" : { "data" : Kline_table.to_json(orient = "records") }})
        json1 = json.dumps(json1)

        return json1

    def handle_to_json(self, result : dict) -> json:
        json1 = json.loads(json.dumps(result))
        json1.update({"table_data" : { "data" : self._table_data }})
        json1 = json.dumps(json1)

        return json1
    
    def method1(self) -> json:
        pos_BIAS, neg_BIAS, support, resistance, ma_o, annotations_labels = [[] for i in range(6)]

        for i in range(self._ma_len, len(self._ma), 1):
            temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
            
            if temp >= 0:
                pos_BIAS.append(round(float(temp), 4))
            else:
                neg_BIAS.append(round(float(temp), 4))

        pos_BIAS.sort()
        neg_BIAS.sort()

        pos_BIAS_val = float(pos_BIAS[int(len(pos_BIAS) * 0.95) - 1])
        neg_BIAS_val = float(neg_BIAS[int(len(neg_BIAS) * 0.05) - 1])

        for i in range(self._ma_len, len(self._ma), 1):
            support.append([self._df["Date"][i], round((1 + neg_BIAS_val) * self._ma[i], 2)])
            ma_o.append([self._df["Date"][i], round(self._ma[i], 2)])
            resistance.append([self._df["Date"][i], round((1 + pos_BIAS_val) * self._ma[i], 2)])
            
            if float(self._df["Close"][i]) > resistance[i - self._ma_len][1]:
                annotations_labels.append({
                    "x" : self._df["Date"][i],
                    "title" : "X",
                    "text" : "穿越天花板線"
                })
            
            if float(self._df["Close"][i]) < support[i - self._ma_len][1]:
                annotations_labels.append({
                    "x" : self._df["Date"][i],
                    "title" : "X",
                    "text" : "穿越地板線"
                })

        self._df = self._df.drop(columns = ["Volume"])

        self.insert_new_data_to_db({
            "support" : support,
            "resistance" : resistance,
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "annotations_labels" : annotations_labels,
            "pos_BIAS" : pos_BIAS,
            "neg_BIAS" : neg_BIAS,
        })

        return self.handle_to_json({
            "support" : support,
            "resistance" : resistance,
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "annotations_labels" : annotations_labels
        })

    def method2(self) -> json:
        neg_BIAS, support, ma_o, annotations_labels = [[] for i in range(4)]

        for i in range(self._ma_len, len(self._ma), 1):
            if self._df["Close"][i] < self._ma[i]:
                temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        neg_BIAS_std = np.std(neg_BIAS)

        for i in range(self._ma_len, len(self._ma), 1):
            temp = self._ma[i] * (1 + (np.mean(neg_BIAS) - 2 * neg_BIAS_std))
            support.append([self._df["Date"][i], round(temp, 2)])
            ma_o.append([self._df["Date"][i], round(self._ma[i], 2)])

            if float(self._df["Close"][i]) < support[i - self._ma_len][1]:
                annotations_labels.append({
                    "x" : self._df["Date"][i],
                    "title" : "X",
                    "text" : "穿越地板線"
                })

        return self.handle_to_json({
            "support" : support,
            "resistance" : [],
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "annotations_labels" : annotations_labels
        })
    
    def method3(self) -> json:
        neg_BIAS, ma_o, support1, support2, over_volume, annotations_labels = [[] for i in range(6)]

        vol_avg = self._df["Volume"][len(self._df) - 2 - self._ma_len - 1: len(self._df) - 2].sum() / self._ma_len

        if self._df["Volume"][len(self._df) - 1] > 2 * vol_avg:
            over_volume = 1
        else:
            over_volume = 0

        for i in range(self._ma_len, len(self._ma), 1):
            if self._df["Close"][i] < self._ma[i]:
                temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        neg_BIAS.sort()
        neg_BIAS_1 = neg_BIAS[int(len(neg_BIAS) * 0.01) - 1]
        neg_BIAS_5 = neg_BIAS[int(len(neg_BIAS) * 0.05) - 1]

        for i in range(self._ma_len, len(self._ma), 1):
            support1.append([self._df["Date"][i], round(self._ma[i] + self._ma[i] * neg_BIAS_1, 2)])
            support2.append([self._df["Date"][i], round(self._ma[i] + self._ma[i] * neg_BIAS_5, 2)])
            ma_o.append([self._df["Date"][i], round(self._ma[i], 2)])

            if float(self._df["Close"][i]) < support1[i - self._ma_len][1]:
                annotations_labels.append({
                    "x" : self._df["Date"][i],
                    "title" : "X1",
                    "text" : "穿越地板線1%"
                })

            if float(self._df["Close"][i]) < support2[i - self._ma_len][1]:
                annotations_labels.append({
                    "x" : self._df["Date"][i],
                    "title" : "X5",
                    "text" : "穿越地板線5%"
                })

        return self.handle_to_json({
            "support1" : support1,
            "support2" : support2,
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "over" : over_volume,
            "annotations_labels" : annotations_labels
        })
        
if __name__ == "__main__":
    SR = SupportResistance(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), sys.argv[5])
    
    if SR.isExist():
        print(SR.get_data_db())
        sys.stdout.flush()
        sys.exit()

    SR.get_data_yfinance()

    if sys.argv[5] == "method1":
        print(SR.method1())
        sys.stdout.flush()

    elif sys.argv[5] == "method2":
        print(SR.method2())
        sys.stdout.flush()

    elif sys.argv[5] == "method3":
        print(SR.method3())
        sys.stdout.flush()