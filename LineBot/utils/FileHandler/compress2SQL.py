import MySQLdb
import MySQLdb.cursors
import patoolib
import os
import shutil
import pandas as pd
from tqdm import tqdm
import json

root_path = json.load(open("../root_path.json"))

class Compress2SQL():
    def __init__(self, db, cursor) -> None:
        self._db = db
        self._cursor = cursor
        self._copmpress_dir = root_path["COMPRESS_DIR_PATH"] + "/"
        self._decompress_dir = root_path["DECOMPRESS_DIR_PATH"] + "/"
        self._destination_dir = root_path["DESTINATION_DIR_PATH"] + "/"

    def run(self) -> None:
        compress_files = os.listdir(self._copmpress_dir)

        for compress_file in tqdm(compress_files):
            date = compress_file[0:8]

            self._compress(compress_file)
            self._decompress_handle(compress_file, date)
            os.remove(self._copmpress_dir + compress_file)

    def _compress(self, filename : str) -> None:
        patoolib.extract_archive(self._copmpress_dir + filename, outdir = self._decompress_dir)

    def _decompress_handle(self, filename : str, date : str) -> None:
        decompress_files = os.listdir(self._decompress_dir + filename[:-4])

        for decompress_file in decompress_files:
            field = decompress_file.split("_")

            key = self._find_key(field[0])

            if key == -1:
                continue
            
            db_filename = f"{field[0]}-{field[1]}-{date}-{field[2]}-{field[-1][:-4]}.pdf"

            if not self._isDuplicate(key, date[0:4] + "-" + date[4:6] + "-" + date[6:8], field[2], db_filename, field[-1][:-4]):
                self._insert(key, date[0:4] + "-" + date[4:6] + "-" + date[6:8], field[2], db_filename, field[-1][:-4])
                self._move_file(filename[:-4], field[0], decompress_file, db_filename)
        shutil.rmtree(self._decompress_dir + filename[:-4])

    def _find_key(self, stock_num : str) -> int:
        query = f'SELECT ID FROM ticker_list WHERE stock_num="{stock_num}"'

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return -1
            
        return result["ID"][0]

    def _isDuplicate(self, key : str, date : str, investmentCompany : str, filename : str, recommend : str) -> bool:
        query = "SELECT * from financialData WHERE ticker_id=%s AND date=%s AND investmentCompany=%s AND \
            filename=%s AND recommend=%s;"

        param = (key, date, investmentCompany, filename, recommend)

        self._cursor.execute(query, param)
        self._db.commit()
        
        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True

    def _insert(self, key : str, date : str, investmentCompany : str, filename : str, recommend : str) -> None:
        query = "INSERT INTO financialData (ticker_id, date, investmentCompany, filename, recommend) \
            VALUE (%s, %s, %s, %s, %s);"

        param = (key, date, investmentCompany, filename, recommend)
        self._cursor.execute(query, param)
        self._db.commit()
    
    def _move_file(self, dir_name : str, stock_num : str, origin_filename : str, new_filename : str) -> None:
        if not os.path.exists(self._destination_dir + stock_num + "/" + new_filename):
            os.rename(self._decompress_dir + dir_name + "/" + origin_filename, self._destination_dir + stock_num + "/" + new_filename)

if __name__ == "__main__":
    db = MySQLdb.connect(host = "140.116.214.134", user = "financialSite", passwd = "624001479",
        db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
    cursor = db.cursor()
    
    c2sql = Compress2SQL(db, cursor)

    c2sql.run()