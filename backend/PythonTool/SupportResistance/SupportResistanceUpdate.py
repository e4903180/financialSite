import pandas as pd
import sys
import talib
import json
import yfinance as yf
import numpy as np
import MySQLdb
import MySQLdb.cursors
import pandas as pd
import datetime

class SupportResistanceUpdate():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint",
            passwd = "CEMj8ptYHraxNxFt", db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
        self.data = None
    
    def get_data_db(self) -> None:
        self._cursor.execute('SELECT * FROM support_resistance')

        self.data = self._cursor.fetchall()
    
    def get_newest_yfinance(self, ticker : str, start_date : str) -> list:
        df = yf.download(ticker + ".TWO", start = start_date, progress = False, show_errors = False)

        if df.empty:
            df = yf.download(ticker + ".TW", start = start_date, progress = False, show_errors = False)

        df = df.reset_index().drop(columns = ["Adj Close"])
        df = df.rename(columns = {'Date': 'ID'})
        df["Open"] = df["Open"].round(2)
        df["High"] = df["High"].round(2)
        df["Low"] = df["Low"].round(2)
        df["Close"] = df["Close"].round(2)

        return df.iloc[-1].fillna(0.0).to_list()

    def _update_Kline(self, new_data : list, old_data : dict) -> list:
        Kline = json.loads(old_data["Kline"])

        Kline.append(new_data[:-1])
        old_data["Kline"] = json.dumps(Kline)

        return Kline

    def _update_volume(self, new_data : list, old_data : dict) -> None:
        volume = json.loads(old_data["volume"])
        volume.append([new_data[0], float(new_data[-1])])
        old_data["volume"] = json.dumps(volume)

        return

    def _update_ma_BIAS(self, new_data : list, ma_close : list, old_data : dict) -> None:
        if old_data["ma_type"] == "wma":
            ma = talib.WMA(ma_close, timeperiod = old_data["ma_len"])
        elif old_data["ma_type"] == "sma":
            ma = talib.SMA(ma_close, timeperiod = old_data["ma_len"])

        # update BIAS
        BIAS = (new_data[4] - ma ) / ma

        if BIAS[-1] >= 0:
            pos_BIAS = json.loads(old_data["pos_BIAS"])
            pos_BIAS.append(round(BIAS[-1], 2))
            pos_BIAS.sort()
            old_data["pos_BIAS"] = json.dumps(pos_BIAS)
        else:
            neg_BIAS = json.loads(old_data["neg_BIAS"])
            neg_BIAS.append(round(BIAS[-1], 2))
            neg_BIAS.sort()
            old_data["neg_BIAS"] = json.dumps(neg_BIAS)

        # update ma line
        ma_line = json.loads(old_data["ma_line"])
        ma_line.append([new_data[0], round(ma[-1], 2)])
        old_data["ma_line"] = json.dumps(ma_line)

        return

    def _update_else(self, new_data : list, old_data : dict) -> None:
        if old_data["method"] == "method1":
            self._method1(new_data, old_data)

        elif old_data["method"] == "method2":
            self._method2(new_data, old_data)

        elif old_data["method"] == "method3":
            self._method3(new_data, old_data)
        return
        
    def _method1(self, new_data : list, old_data : dict) -> None:
        pos_BIAS = json.loads(old_data["pos_BIAS"])
        neg_BIAS = json.loads(old_data["neg_BIAS"])
        support = json.loads(old_data["support"])
        resistance = json.loads(old_data["resistance"])
        ma_line = json.loads(old_data["ma_line"])
        annotations_labels = json.loads(old_data["annotations_labels"])

        pos_BIAS_val = float(pos_BIAS[int(len(pos_BIAS) * 0.95) - 1])
        neg_BIAS_val = float(neg_BIAS[int(len(neg_BIAS) * 0.05) - 1])

        support.append([new_data[0], round((1 + neg_BIAS_val) * ma_line[-1][1], 2)])
        resistance.append([new_data[0], round((1 + pos_BIAS_val) * ma_line[-1][1], 2)])

        if new_data[4] > resistance[-1][1]:
            annotations_labels.append({
                "x" : new_data[0],
                "title" : "X",
                "text" : "穿越天花板線"
            })
            
        if new_data[4] < support[-1][1]:
            annotations_labels.append({
                "x" : new_data[0],
                "title" : "X",
                "text" : "穿越地板線"
            })

        old_data["support"] = json.dumps(support)
        old_data["resistance"] = json.dumps(resistance)
        old_data["annotations_labels"] = json.dumps(annotations_labels)

        return

    def _method2(self, new_data : list, old_data : dict) -> None:
        neg_BIAS = json.loads(old_data["neg_BIAS"])
        support = json.loads(old_data["support"])
        ma_line = json.loads(old_data["ma_line"])
        annotations_labels = json.loads(old_data["annotations_labels"])

        neg_BIAS_std = np.std(neg_BIAS)

        support.append([new_data[0], ma_line[-1][1] * (1 + (np.mean(neg_BIAS) - 2 * neg_BIAS_std))])
            
        if new_data[4] < support[-1][1]:
            annotations_labels.append({
                "x" : new_data[0],
                "title" : "X",
                "text" : "穿越地板線"
            })

        old_data["support"] = json.dumps(support)
        old_data["annotations_labels"] = json.dumps(annotations_labels)

        return

    def _method3(self, new_data : list, old_data : dict) -> None:
        neg_BIAS = json.loads(old_data["neg_BIAS"])
        support1 = json.loads(old_data["support"])["support1"]
        support2 = json.loads(old_data["support"])["support2"]
        volume = json.loads(old_data["volume"])
        ma_line = json.loads(old_data["ma_line"])
        annotations_labels = json.loads(old_data["annotations_labels"])
        
        vol_avg = sum([vol[1] for vol in volume][len(volume) - 2 - old_data["ma_len"]: len(volume) - 2]) / old_data["ma_len"]

        if volume[-1][1] > 2 * vol_avg:
            over_volume = 1
        else:
            over_volume = 0

        neg_BIAS_1 = neg_BIAS[int(len(neg_BIAS) * 0.01) - 1]
        neg_BIAS_5 = neg_BIAS[int(len(neg_BIAS) * 0.05) - 1]

        support1.append([new_data[0], round(ma_line[-1][1] + ma_line[-1][1] * neg_BIAS_1, 2)])
        support2.append([new_data[0], round(ma_line[-1][1] + ma_line[-1][1] * neg_BIAS_5, 2)])

        if new_data[4] < support1[-1][1]:
            annotations_labels.append({
                "x" : self._df["Date"][i],
                "title" : "X1",
                "text" : "穿越地板線1%"
            })

        if new_data[4] < support2[-1][1]:
            annotations_labels.append({
                "x" : self._df["Date"][i],
                "title" : "X5",
                "text" : "穿越地板線5%"
            })

        old_data["support"] = json.dumps({"support1" : support1, "support2" : support2})
        old_data["annotations_labels"] = json.dumps(annotations_labels)
        old_data["over_volume"] = over_volume

        return

    def update2SQL(self, updated_old_data : dict):
        self._cursor.execute("UPDATE support_resistance SET `Kline`=%s,`volume`=%s,`pos_BIAS`=%s,`neg_BIAS`=%s,`ma_line`=%s,`annotations_labels`=%s,`support`=%s,`resistance`=%s WHERE `ticker`=%s AND `ma_type`=%s AND `ma_len`=%s AND `start_date`=%s AND `method`=%s", (
                            updated_old_data["Kline"],
                            updated_old_data["volume"],
                            updated_old_data["pos_BIAS"],
                            updated_old_data["neg_BIAS"],
                            updated_old_data["ma_line"],
                            updated_old_data["annotations_labels"],
                            updated_old_data["support"],
                            updated_old_data["resistance"],
                            updated_old_data["ticker"],
                            updated_old_data["ma_type"],
                            updated_old_data["ma_len"],
                            updated_old_data["start_date"],
                            updated_old_data["method"],
                        )
        )
        self._db.commit()

    def update(self, new_data : list, old_data : dict) -> dict:
        # time to datetime
        new_data[0] = pd.to_datetime([new_data[0]]).astype(int)[0] / 10**6

        # update Kline
        Kline = self._update_Kline(new_data, old_data)

        # update Volume
        self._update_volume(new_data, old_data)

        # update ma_line and BIAS
        ma_close = np.array([Kline[i][4] for i in range(len(Kline) - 1, len(Kline) - 1 - old_data["ma_len"], -1)])
        self._update_ma_BIAS(new_data, ma_close, old_data)

        # according to method update annotations_labels, support, resistance
        self._update_else(new_data, old_data)

        return old_data


if __name__ == "__main__":
    sys.stderr = open("/home/cosbi/桌面/financialData/SupportResistance/" + str(datetime.date.today()) + '.log', 'w')
    SRU = SupportResistanceUpdate()
    SRU.get_data_db()

    for i in range(len(SRU.data)):
        updated_old_data = SRU.update(SRU.get_newest_yfinance(SRU.data[i]["ticker"], SRU.data[i]["start_date"]), SRU.data[i])
        SRU.update2SQL(updated_old_data)
        