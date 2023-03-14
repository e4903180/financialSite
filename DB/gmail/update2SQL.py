import MySQLdb
import pandas as pd
from datetime import datetime
import logging
import MySQLdb.cursors
from tqdm import trange
import json

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level = logging.INFO, filename = root_path["GMAIL_DATA_LOG_PATH"] + "/" + datetime.now().strftime("%Y_%m_%d") + '_SQL.log', filemode = 'w', format = FORMAT)
logging.info('Updating gmail data to sql')

db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
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

def isDuplicate(ticker_id, date, investmentCompany, filename, recommend):
    query = "SELECT * from financialData WHERE ticker_id=%s AND date=%s AND \
        investmentCompany=%s AND filename=%s AND recommend=%s;"

    param = (ticker_id, date, investmentCompany, filename, recommend)

    cursor.execute(query, param)
    db.commit()
    
    result = pd.DataFrame.from_dict(cursor.fetchall())

    return False if result.empty else True

try:
    csvName = datetime.now().strftime("%Y_%m_%d") + ".csv"
    df = pd.read_csv(root_path["GMAIL_DATA_DATAFRAME_PATH"] + "/" + csvName)
    df = df.fillna("NULL")
    df.drop_duplicates(inplace = True)
    df.reset_index(drop = True, inplace = True) 

    for i in trange(len(df)):
        temp = df.iloc[i]
        key = find_key(temp["Number"])

        if isDuplicate(key, temp["Date"], temp["Investment company"], temp["Filename"], temp["Recommend"]):
            continue
        
        logging.info(temp)
        cursor.execute('INSERT INTO financialData (ticker_id, date, investmentCompany, filename, recommend) '
                'VALUES (%s, %s, %s, %s, %s);', (key, temp["Date"], temp["Investment company"], temp["Filename"], temp["Recommend"]))
        db.commit()

    db.close()
    logging.info('Updating complete')
except Exception as e:
    logging.info(e)
    logging.info('Updating failed')