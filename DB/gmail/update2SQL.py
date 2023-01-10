import MySQLdb
import pandas as pd
from datetime import datetime
import logging
import MySQLdb.cursors
from tqdm import trange

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level = logging.INFO, filename = "/home/cosbi/桌面/financialData/gmailData/log/" + datetime.now().strftime("%Y_%m_%d") + '_SQL.log', filemode = 'w', format = FORMAT)
logging.info('Updating gmail data to sql')

db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)

cursor = db.cursor()

def find_key(stock_num):
    query = f'SELECT ID FROM ticker_list WHERE stock_num="{stock_num}"'

    cursor.execute(query)
    db.commit()

    result = pd.DataFrame.from_dict(cursor.fetchall())

    if result.empty:
        return -1
        
    return result["ID"][0]

try:
    csvName = datetime.now().strftime("%Y_%m_%d") + ".csv"
    df = pd.read_csv("/home/cosbi/桌面/financialData/gmailData/dataFrame/" + csvName)
    df = df.fillna("NULL")
    df.drop_duplicates(inplace = True)
    df.reset_index(drop = True, inplace = True) 

    for i in trange(len(df)):
        temp = df.iloc[i]
        key = find_key(temp["Number"])
        
        cursor.execute('INSERT INTO financialData (ticker_id, date, investmentCompany, filename, recommend) '
                'VALUES (%s, %s, %s, %s, %s);', (key, temp["Date"].replace("_", "-"), temp["Investment company"], temp["Filename"], temp["Recommend"]))
        db.commit()

    db.close()
    logging.info('Updating complete')
except Exception as e:
    logging.info(e)
    logging.info('Updating failed')

