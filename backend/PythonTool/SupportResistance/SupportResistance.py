import pandas as pd
import sys
import json
import talib
import numpy as np
import yfinance as yf
import pandas as pd

class SupportResistance():
    """Calculate support resistance

    """

    def __init__(self, stock_num : str, start_date : str, ma_type : str, ma_len : int) -> None:
        """Init local value

        Args:
            stock_num : (String) ticker number
            start_date : (String) start date of data
            ma_type : (String) ma type
            ma_len : (int) ma len
        
        Returns:
            None
        """
        self._ma, self._volume = [[] for i in range(2)]
        self._table_data = []
        self._df = None

        self._ma_len = ma_len
        self._stock_num = stock_num
        self._start_date = start_date
        self._ma_type = ma_type

    def get_data_yfinance(self) -> None:
        """Get data from yahoo finance

        Use yahoo finance api to get data.

        Args:
            None
        
        Returns:
            None
        """

        self._df = yf.download(self._stock_num + ".TWO", start = self._start_date, progress = False, show_errors = False)

        if self._df.empty: self._df = yf.download(self._stock_num + ".TW", start = self._start_date, progress = False, show_errors = False)
        if (self._df.empty) or (len(self._df) < 2): 
            print(self.handle_to_json({
                "support" : [],
                "resistance" : [],
                "Kline" : [],
                "volume": [],
                "ma" : [],
                "annotations_labels" : []
            }))
            sys.stdout.flush()
            sys.exit(0)

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

        if self._ma_type == "wma": self._ma = talib.WMA(self._df["Close"], timeperiod = self._ma_len)
        elif self._ma_type == "sma": self._ma = talib.SMA(self._df["Close"], timeperiod = self._ma_len)

    def handle_to_json(self, result : dict) -> json:
        """Transform support resistance dict data to json format
        
            Args:
                result: (dict) data of support resistance
                    example:
                        {
                            "support" : [[12000, 20], ...],
                            "resistance" : [[12000, 50], ...],
                            "Kline" : [[12000, 37, 40, 30, 35], ...],
                            "volume": [[12000, 50000]. ...],
                            "ma" : [[12000, 40]. ...],
                            "annotations_labels" : [{
                                "x" : 12000,
                                "title" : "X",
                                "text" : "穿越地板線"
                            }]
                        }
            
            Returns:
                json1 : (json) Json format of result
        """
        json1 = json.loads(json.dumps(result))
        json1.update({"table_data" : { "data" : self._table_data }})
        json1 = json.dumps(json1)

        return json1
    
    def method1(self) -> json:
        """Calculate support resistance through method1
        
            Args:
                None
            
            Return:
                json1 : (json) Json format of result
        """

        pos_BIAS, neg_BIAS, support, resistance, ma_o, annotations_labels = [[] for i in range(6)]

        # Traverse ma to calculate BIAS
        for i in range(self._ma_len, len(self._ma), 1):
            temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
            
            if temp >= 0:
                pos_BIAS.append(round(float(temp), 4))
            else:
                neg_BIAS.append(round(float(temp), 4))

        pos_BIAS.sort()
        neg_BIAS.sort()

        # Define threshold of support resistance
        pos_BIAS_val = float(pos_BIAS[int(len(pos_BIAS) * 0.95) - 1])
        neg_BIAS_val = float(neg_BIAS[int(len(neg_BIAS) * 0.05) - 1])

        # Traverse ma to calculate support resistance and cross detect
        for i in range(self._ma_len - 1, len(self._ma), 1):
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

        return self.handle_to_json({
            "support" : support,
            "resistance" : resistance,
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "annotations_labels" : annotations_labels
        })

    def method2(self) -> json:
        """Calculate support resistance through method2
        
            Args:
                None
            
            Return:
                json1 : (json) Json format of result
        """

        neg_BIAS, support, ma_o, annotations_labels = [[] for i in range(4)]

        # Traverse ma to calculate BIAS
        for i in range(self._ma_len - 1, len(self._ma), 1):
            if self._df["Close"][i] < self._ma[i]:
                temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        # Define threshold of support
        neg_BIAS_std = np.std(neg_BIAS)

        # Traverse ma to calculate support and cross detect
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
        """Calculate support resistance through method3
        
            Args:
                None
            
            Return:
                json1 : (json) Json format of result
        """

        neg_BIAS, ma_o, support1, support2, over_volume, annotations_labels = [[] for i in range(6)]

        # Calculate average of volume through ma len
        vol_avg = self._df["Volume"][len(self._df) - 2 - self._ma_len: len(self._df) - 2].sum() / self._ma_len

        # Detect cross average volume
        over_volume = 1 if self._df["Volume"][len(self._df) - 1] > 2 * vol_avg else 0

        # Traverse ma to calculate BIAS
        for i in range(self._ma_len - 1, len(self._ma), 1):
            if self._df["Close"][i] < self._ma[i]:
                temp = (float(self._df["Close"][i]) - self._ma[i]) / self._ma[i]
                neg_BIAS.append(temp)

        # Define threshold of support
        neg_BIAS.sort()
        neg_BIAS_1 = neg_BIAS[int(len(neg_BIAS) * 0.01) - 1]
        neg_BIAS_5 = neg_BIAS[int(len(neg_BIAS) * 0.05) - 1]

        # Traverse ma to calculate support and cross detect
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
            "support" : {"support1" : support1, "support2" : support2},
            "Kline" : self._df.values.tolist(),
            "volume": self._volume,
            "ma" : ma_o,
            "over" : over_volume,
            "annotations_labels" : annotations_labels
        })
        
if __name__ == "__main__":
    # sys.argv[1] 股票代號
    # sys.argv[2] 起始日期
    # sys.argv[3] ma類型
    # sys.argv[4] ma長度
    # sys.argv[5] 方法

    SR = SupportResistance(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]))

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