import os
import sys
import json
import MySQLdb
import MySQLdb.cursors
import datetime
from tqdm import tqdm
import pandas as pd
from typing import List

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

class Update2SQL():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def _find_key(self, stock_num : str):
        query = 'SELECT ID FROM ticker_list WHERE stock_num=%s'
        param = (stock_num,)

        self._cursor.execute(query, param)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return -1
            
        return result["ID"][0]
    
    def _isDuplicate(self, key : int, info : List) -> bool:
        """Check if data is duplicate

            Args :
                key : (int) foreign key id
                info : (List) list of information got from filename
                    ex:
                        [2886, 兆豐金, 2023-03-22, CTBC, 中立, 兆豐銀資本相對充足，尚無AT1直接衝擊影響]
            
                Return :
                    bool
        """
        query = "SELECT * from financialData WHERE ticker_id=%s AND date=%s AND \
            investmentCompany=%s AND filename=%s AND recommend=%s AND remark=%s;"
        param = tuple([key].extend(info[1:]))

        self._cursor.execute(query, param)
        self._db.commit()
        
        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return False if result.empty else True
    
    def _insert(self, key : int, info : List) -> None:
        """Insert data to table

            Args :
                key : (int) foreign key id
                info : (List) list of information got from filename
                    ex:
                        [2886, 兆豐金, 2023-03-22, CTBC, 中立, 兆豐銀資本相對充足，尚無AT1直接衝擊影響]
            
                Return :
                    None
        """
        query = "INSERT INTO financialData (ticker_id, date, investmentCompany, filename, recommend, remark) \
                VALUES (%s, %s, %s, %s, %s, %s);"
        param = tuple([key].extend(info[1:]))

        self._cursor.execute(query, param)
        self._db.commit()
    
    def _move_file(self, origin_path : str, fileanme : str, stock_num : str) -> None:
        """Move file to directory if stock_num

            Args :
                path : (str) path of file
                    ex:
                        /uikai/financialData/unzip/20230330/1\
                            /2886_兆豐金_20230322_CTBC_中立_兆豐銀資本相對充足，尚無AT1直接衝擊影響.pdf
                filename : (str) file name
                    ex:
                        2886_兆豐金_20230322_CTBC_中立_兆豐銀資本相對充足，尚無AT1直接衝擊影響.pdf
                stock_num : (str) stock number

            Return :
                None
        """
        destination_path = f"{root_path['GMAIL_DATA_DATA_PATH']}/{stock_num}/{fileanme}"

        if os.path.isfile(destination_path):
            return
        
        os.rename(origin_path, destination_path)

    def run(self, dir : str) -> None:
        if not os.path.isdir(dir):
            print(f"{dir} is not exist", file = sys.stderr)
        
        for filename in tqdm(os.listdir(dir)):
            # 2886_兆豐金_20230322_CTBC_中立_兆豐銀資本相對充足，尚無AT1直接衝擊影響.pdf
            info = filename.split("_")

            # Drop ".pdf"
            info[-1] = info[-1][:-4]

            # Change date formate from %Y%m%d to %Y-%m-%d
            info[2] = f"{info[2][:4]}-{info[2][4:6]}-{info[2][6:]}"

            # find foreign key id
            key = self._find_key(info[0])

            if key == -1:
                print(f"{key} not exist in foreign key", file = sys.stderr)
                continue

            if self._isDuplicate(key, info):
                print(f"{filename} is existed", file = sys.stderr)
                continue

            self._insert(key, info)
            self._move_file(f"{dir}/{filename}", filename, info[0])

if __name__ == "__main__":
    sys.stderr = open(root_path["GMAIL_DATA_LOG_PATH"] + f"{str(datetime.datetime.now())}_SQL.log", 'w')

    update_2_sql = Update2SQL()

    update_2_sql.run(sys.argv[1])