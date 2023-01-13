import MySQLdb
import MySQLdb.cursors
import pandas as pd
import talib
import numpy as np
import json
from tqdm import tqdm

temp = pd.read_csv("2017-01-03.csv")

db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
            db = "twStock", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
cursor = db.cursor()

tickers = temp["stock_num"].to_list()

for ticker in tqdm(tickers):
    query = ('SELECT ticker_list.stock_num, twStock.Date, twStock.Close \
        FROM twStock INNER JOIN ticker_list ON twStock.ticker_id=ticker_list.ID \
        WHERE YEAR(twStock.date)="2017" AND MONTH(twStock.date)>="01" AND MONTH(twStock.date)<="06" AND ticker_list.stock_num="%s"') % (ticker)

    cursor.execute(query)
    db.commit()

    result = pd.DataFrame.from_dict(cursor.fetchall())

    if result.empty:
        continue
    
    price = np.array(result["Close"].to_list())
    ma_5 = np.round(talib.SMA(price, timeperiod = 5), 2).tolist()
    ma_15 = np.round(talib.SMA(price, timeperiod = 15), 2).tolist()
    ma_30 = np.round(talib.SMA(price, timeperiod = 30), 2).tolist()

    query = 'SELECT ID FROM ticker_list WHERE stock_num="%s"' % (ticker)
    cursor.execute(query)
    db.commit()

    result = pd.DataFrame.from_dict(cursor.fetchall())
    key = result["ID"][0]

    query = 'INSERT INTO technicalAnalysis (`ticker_id`, `5ma`, `15ma`, `30ma`) VALUES ("%s", "%s", "%s", "%s")' % (key, json.dumps(ma_5[4:]), json.dumps(ma_15[14:]), json.dumps(ma_30[29:]))
    cursor.execute(query)
    db.commit()

    query = 'INSERT INTO ticker_filter (`ticker_id`, `5ma_15ma_golden_cross`, `5ma_30ma_golden_cross`, \
        `5ma_15ma_death_cross`, `5ma_30ma_death_cross`) VALUES ("%s", %s, %s, %s, %s)' % (key, 
        ((ma_5[-2] < ma_15[-2]) and (ma_5[-1] > ma_15[-1])),
        ((ma_5[-2] < ma_30[-2]) and (ma_5[-1] > ma_30[-1])), 
        ((ma_5[-2] > ma_15[-2]) and (ma_5[-1] < ma_15[-1])),
        ((ma_5[-2] > ma_30[-2]) and (ma_5[-1] < ma_30[-1])))

    cursor.execute(query)
    db.commit()