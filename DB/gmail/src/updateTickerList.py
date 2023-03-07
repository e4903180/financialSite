import MySQLdb
import pandas as pd
import MySQLdb.cursors
import json

db_config = json.load(open("../../../db_config.json"))
root_path = json.load(open("../../../root_path.json"))

db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
            db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)

cursor = db.cursor()

query = 'SELECT stock_name FROM ticker_list'

cursor.execute(query)
db.commit()

result = pd.DataFrame.from_dict(cursor.fetchall())

stock_num = []
stock_name = []

for i in result["stock_name"].to_list():
    temp = i.split(" ")
    stock_num.append(temp[0])
    stock_name.append(temp[1])

df = pd.DataFrame({"股票代號" : stock_num, "股票名稱" : stock_name})

chinese = ["台新投顧", "元大", "宏遠", "麥格理", "美林", "摩根史丹利",
            "高勝", "瑞士信貸", "德意志", "野村", "花旗", "第一金", "日盛投顧",
            "統一投顧", "元富", "德信", "兆豐金", "國票", "摩根大通", "康和",
            "國泰證期", "大和國泰", "華南投顧", "凱基", "富邦台灣", "群益",
            "中信投顧", "匯豐", "法國巴黎", "里昂", "永豐金", "玉山金", "永豐投顧",
            "CTBC", "國票投顧"]

df1 = pd.DataFrame({"中文名稱" : chinese})

with pd.ExcelWriter("24932_個股代號及券商名稱.xlsx") as writer:
    df.to_excel(writer, sheet_name = '股票代號', index = False)
    df1.to_excel(writer, sheet_name = '券商名稱', index = False)