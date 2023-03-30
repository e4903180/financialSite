import json
import datetime
import os
import sys
from tqdm import tqdm
import MySQLdb
import MySQLdb.cursors
import fitz
import pandas as pd
from typing import List

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

def sino_pac_ex(directory_path : str) -> str:
    possible_ans = ['買進', '中立']

    # Worest case is NULL
    rate_1, rate_2 = "NULL"

    # Avoid nested struct
    # Nested struct, lower than 3 layers

    # If the error is clear definition, use if else rather then try except
    with fitz.open(directory_path) as doc:
        page = doc.load_page(0)
        rect = page.rect

        page_check_source = doc.load_page(-1)
        text_check_source = page_check_source.get_text()

        if '永豐證券投資顧問股份有限公司' in text_check_source:
            # 報告為舊版 提取評價的第一種方法
            # Cannot find which errors will occur
            clip_old_version_1 = fitz.Rect(220, 80, 560, 140)
            text_old_version_1 = page.get_text(clip=clip_old_version_1).strip()
            text_old_version_1 = text_old_version_1.split('）')[1].strip()
            rate_1 = text_old_version_1.split('\n')[1].strip()

            # 提取評價的第二種方法
            # Cannot find which errors will occur
            clip_old_version_2 = fitz.Rect(425, 90, 560, 130)
            rate_2 = page.get_text(clip=clip_old_version_2).strip()

        elif 'SinoPac Securities' in text_check_source:
            # 報告為新版 檢查報告版本
            clip_check_report = fitz.Rect(0, 0, rect.width, 150)
            text_check_report = page.get_text(clip=clip_check_report, sort=True).strip()

            if '個股聚焦' in text_check_report:
                # 提取評價的第一種方法
                # Cannot find which errors will occur
                clip_new_version_1 = fitz.Rect(0, 0, 200, 400)
                text_new_version_1 = page.get_text(clip=clip_new_version_1).strip()
                text_new_version_1 = text_new_version_1.split('投資建議')[1]
                rate_1 = text_new_version_1.split('\n')[0].strip()

                # 提取評價的第二種方法
                # Cannot find which errors will occur
                clip_new_version_2 = fitz.Rect(75, 200, 120, 235)
                text_new_version_1 = page.get_text(clip=clip_new_version_2).strip()
                rate_2 = text_new_version_1
    
    # 檢查兩種方法提取的評價是否相同
    if rate_1 == rate_2:
        return rate_1 if rate_1 != "NULL" else "NULL"

    # "in" operator in python, time complexity is O(n)
    # If rate_1 not in possible_ans, time complexity is O(n)
    # If rate_2 not in possible_ans, time complexity is O(n)
    # Total time complexity = O(n) + O(n)

    # If traver list, time complexity is O(n)
    for possible in possible_ans:
        if possible == rate_1:
            return possible

        elif possible == rate_2:
            return possible

    return "NULL"

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
    
    def _isDuplicate(self, info : List) -> bool:
        """Check if data is duplicate

            Args :
                info : (List) list of information got from filename
                    ex:
                        [foreign key id, 2023-03-22, CTBC, 2886_兆豐金_20230322_CTBC_中立_兆豐銀資本相對充足，尚無AT1直接衝擊影響.pdf,
                            中立, 兆豐銀資本相對充足，尚無AT1直接衝擊影響]

                Return :
                    bool
        """
        query = "SELECT * from financialData WHERE ticker_id=%s AND date=%s AND \
            investmentCompany=%s AND filename=%s AND recommend=%s AND remark=%s;"
        param = tuple(info)

        self._cursor.execute(query, param)
        self._db.commit()
        
        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        return False if result.empty else True
    
    def _insert(self, info : List) -> None:
        """Insert data to table

            Args :
                info : (List) list of information got from filename
                    ex:
                        [foreign key id, 2023-03-22, CTBC, 2886_兆豐金_20230322_CTBC_中立_兆豐銀資本相對充足，尚無AT1直接衝擊影響.pdf,
                            中立, 兆豐銀資本相對充足，尚無AT1直接衝擊影響]

                Return :
                    None
        """
        query = "INSERT INTO financialData (ticker_id, date, investmentCompany, filename, recommend, remark) \
                VALUES (%s, %s, %s, %s, %s, %s);"
        param = tuple(info)

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
            stock_num = info[0]

            if key == -1:
                print(f"{key} not exist in foreign key", file = sys.stderr)
                continue
            
            info = [key] + info[2:4] + [filename] + info[4:]

            if self._isDuplicate(info):
                print(f"{filename} is existed", file = sys.stderr)
                continue
            
            self._insert(info)
            self._move_file(f"{dir}/{filename}", filename, stock_num)


class ExtractPdfRate():
    """Create handle for vary investment companies
    """
    def __init__(self) -> None:
        pass

    def sino_pac(self, directory_path : str) -> str:
        """Handle 永豐投顧(SinoPac) pdf

            Args :
                directory_path : (str) pdf path
            
            Return :
                rate : (str) recommend
        """
        possible_ans = ['買進', '中立']
        rate_1 = None
        rate_2 = None
        rate = None
        try:
            # 使用with語句讀取PDF文件，確保在使用後自動關閉文件。
            with fitz.open(directory_path) as doc:
                page = doc.load_page(0)  # 加載文檔的第0頁
                rect = page.rect
                try:
                    # 檢查是否由永豐投顧出版
                    page_check_source = doc.load_page(-1)   # 加載文檔的最後一頁
                    text_check_source = page_check_source.get_text()
                    if 'SinoPac Securities' or '永豐證券投資顧問股份有限公司' in text_check_source:
                        if '永豐證券投資顧問股份有限公司' in text_check_source:
                            # 報告為舊版
                            try:
                                # 提取評價的第一種方法
                                clip_old_version_1 = fitz.Rect(220, 80, 560, 140)
                                text_old_version_1 = page.get_text(clip=clip_old_version_1).strip()
                                text_old_version_1 = text_old_version_1.split('）')[1].strip()
                                rate_1 = text_old_version_1.split('\n')[1].strip()
                            except:
                                rate_1 = None
                            try:
                                # 提取評價的第二種方法
                                clip_old_version_2 = fitz.Rect(425, 90, 560, 130)
                                rate_2 = page.get_text(clip=clip_old_version_2).strip()
                            except:
                                rate_2 = None
                        elif 'SinoPac Securities' in text_check_source:
                            # 報告為新版
                            # 檢查報告版本
                            clip_check_report = fitz.Rect(0, 0, rect.width, 150)
                            text_check_report = page.get_text(clip=clip_check_report, sort=True).strip()
                            if '個股聚焦' in text_check_report:
                                try:
                                    # 提取評價的第一種方法
                                    clip_new_version_1 = fitz.Rect(0, 0, 200, 400)
                                    text_new_version_1 = page.get_text(clip=clip_new_version_1).strip()
                                    text_new_version_1 = text_new_version_1.split('投資建議')[1]
                                    rate_1 = text_new_version_1.split('\n')[0].strip()
                                # 如果出現任何錯誤，設置rate_1為None。
                                except:
                                    rate_1 = None
                                try:
                                    # 提取評價的第二種方法
                                    clip_new_version_2 = fitz.Rect(75, 200, 120, 235)
                                    text_new_version_1 = page.get_text(clip=clip_new_version_2).strip()
                                    rate_2 = text_new_version_1
                                # 如果出現任何錯誤，設置rate_2為None。
                                except:
                                    rate_2 = None
                            else:
                                rate = 'NULL'
                        # 檢查兩種方法提取的評價是否相同
                        if rate_1 == rate_2:
                            if rate_1 == None:
                                rate = 'NULL'
                            else:
                                rate = rate_1
                        else:
                            if rate_1 in possible_ans:
                                rate = rate_1
                            elif rate_2 in possible_ans:
                                rate = rate_2
                            else :
                                rate = 'NULL'
                    else:
                        rate = 'NULL'
                except:
                    rate = 'NULL'
        except:
            rate = 'NULL'
        return rate
    
    def ibf(self, directory_path : str) -> str:
        """Handle 國票 pdf

            Args :
                directory_path : (str) pdf path
            
            Return :
                rate : (str) recommend
        """
        possible_ans = ['買進', '區間操作', '強力買進']
        rate_1 = None
        rate_2 = None
        rate = None
        try:
            # 使用with語句讀取PDF文件，確保在使用後自動關閉文件。
            with fitz.open(directory_path) as doc:
                page = doc.load_page(0) # 加載文檔的第0頁
                rect = page.rect
                try:
                    # 檢查是否由國票投顧出版
                    page_check_source = doc.load_page(-1)  # 加載文檔的最後一頁
                    clip_check_source = fitz.Rect(0, 0, rect.width, rect.height)
                    text_check_source = page_check_source.get_text(clip=clip_check_source)
                    if '國票投顧所有' in text_check_source:
                        # 檢查報告版本
                        clip_check_version = fitz.Rect(40, 0, rect.width, 400)
                        text_check_version = page.get_text(clip=clip_check_version, sort=True).strip()
                        if '國票觀點' in text_check_version:
                            # 報告為舊版
                            try:
                                # 提取評價的第一種方法
                                clip_old_version_1 = fitz.Rect(380, 0, rect.width, 400)
                                text_old_version_1 = page.get_text(clip=clip_old_version_1).strip()
                                if '目標價' in text_old_version_1:
                                    text_old_version_1 = text_old_version_1.split('目標價')[1].strip()
                                    rate_1 = text_old_version_1.split('\n')[0].strip()
                                elif '區間價位' in text_old_version_1:
                                    text_old_version_1 = text_old_version_1.split('區間價位')[1].strip()
                                    rate_1 = text_old_version_1.split('\n')[0].strip()
                                elif '操作區間' in text_old_version_1:
                                    text_old_version_1 = text_old_version_1.split('操作區間')[1].strip()
                                    rate_1 = text_old_version_1.split('\n')[0].strip()
                                elif '/買進' in text_old_version_1:
                                    text_old_version_1 = text_old_version_1.split('/買進')[1].strip()
                                    rate_1 = text_old_version_1.split('\n')[0].strip()
                                else:
                                    rate_1 = None
                            except:
                                rate_1 = None
                            try:
                                # 提取評價的第二種方法
                                clip_old_version_2 = fitz.Rect(380, 200, 470, 270)
                                text_old_version_2 = page.get_text(clip=clip_old_version_2).strip()
                                if '買進' in text_old_version_2:
                                    rate_2 = '買進'
                                elif '區間操作' in text_old_version_2:
                                    rate_2 = '區間操作'
                                elif '賣出' in text_old_version_2:
                                    rate_2 = '賣出'
                                else:
                                    rate_2 = None
                            except:
                                rate_2 = None
                        else:
                            # 報告為新版
                            try:
                                # 提取評價的第一種方法
                                clip_new_version_1 = fitz.Rect(30, 200, 220, 400)
                                text_new_version_1 = page.get_text(clip=clip_new_version_1, sort=True).strip()
                                if '目標價' in text_new_version_1:
                                    text_new_version_1 = text_new_version_1.split('目標價')[1].strip()
                                    rate_1 = text_new_version_1.split('\n')[0].strip()  
                                elif '區間價位' in text_new_version_1:
                                    text_new_version_1 = text_new_version_1.split('區間價位')[1].strip()
                                    rate_1 = text_new_version_1.split('\n')[0].strip()  
                                elif '操作區間' in text_new_version_1:
                                    text_new_version_1 = text_new_version_1.split('操作區間')[1].strip()
                                    rate_1 = text_new_version_1.split('\n')[0].strip()  
                                else:
                                    rate_1 = None
                            # 如果出現任何錯誤，設置rate_1為None。
                            except:
                                rate_1 = None
                            try:
                                # 提取評價的第二種方法
                                clip_new_version_2 = fitz.Rect(40, 200, 120, 400)
                                text_new_version_2 = page.get_text(clip=clip_new_version_2).strip()
                                if '強力買進' in text_new_version_2:
                                        rate_2 = '強力買進'
                                elif '買進' in text_new_version_2:
                                    rate_2 = '買進'
                                elif '區間操作' in text_new_version_2:
                                    rate_2 = '區間操作'
                                elif '賣出' in text_new_version_2:
                                    rate_2 = '賣出'
                                else:
                                    rate_2 = None
                            # 如果出現任何錯誤，設置rate_2為None。
                            except:
                                rate_2 = None
                        # 檢查兩種方法提取的評價是否相同
                        if rate_1 == rate_2:
                            if rate_1 == None:
                                rate = 'NULL'
                            else:
                                
                                rate = rate_1
                        else:
                            if rate_1 in possible_ans:
                                rate = rate_1
                            elif rate_2 in possible_ans:
                                rate = rate_2
                            else :
                                rate = 'NULL'
                    else:
                        rate = 'NULL'
                except:
                    rate = 'NULL'
        except:
            rate = 'NULL'
        return rate

    def ctbc(self, directory_path : str) -> str:
        """Handle 中信託(CTBC) pdf

            Args :
                directory_path : (str) pdf path
            
            Return :
                rate : (str) recommend
        """
        possible_ans = ['中立', '買進', '增加持股(Overweight)', '中立(Neutral)', 
                        '買進(Buy)', '增加持股', '-', '降低持股(Underweight)', '未評等']
        rate_1 = None
        rate_2 = None
        rate = None
        try:
            # 使用with語句讀取PDF文件，確保在使用後自動關閉文件。
            with fitz.open(directory_path) as doc:
                page = doc.load_page(0)  # 加載文檔的第0頁
                rect = page.rect
                try:
                    # 檢查是否由中信投顧出版
                    page_check_source = doc.load_page(-1) # 加載文檔的最後一頁
                    text_check_source = page_check_source.get_text()
                    if '中國信託金融控股' or '中信投顧投資分析報告' in text_check_source :
                        # 檢查是否為個股報告
                        if '個股報告' in text_check_source :
                            # 檢查報告版本
                            clip_check_version= fitz.Rect(370, 80, 450, 200)
                            text_check_version = page.get_text(clip=clip_check_version, sort=True).strip()
                            if '投資評等' in text_check_version:
                                # 報告為舊版
                                try:
                                    # 提取評價的第一種方法
                                    text_old_version_1 = text_check_version
                                    text_old_version_1 = text_old_version_1.split('投資評等')[1].strip()
                                    rate_1 = text_old_version_1.split('\n')[0].strip()
                                except:
                                    rate_1 = None
                                try:
                                    # 提取評價的第二種方法
                                    clip_old_version_2 = fitz.Rect(370, 120, 430, 150)
                                    rate_2 = page.get_text(clip=clip_old_version_2).strip()
                                except:
                                    rate_2 = None
                            else:
                                # 報告為新版
                                try:
                                    # 提取評價的第一種方法
                                    clip_new_version_1 = fitz.Rect(200, 0, rect.width, 200)
                                    text_new_version_1 = page.get_text(clip=clip_new_version_1, sort=True).strip()
                                    text_new_version_1 = text_new_version_1.split('評 等')[1]
                                    rate_1 = text_new_version_1.split('\n')[1].strip()
                                # 如果出現任何錯誤，設置rate_1為None。
                                except:
                                    rate_1 = None
                                try:
                                    # 提取評價的第二種方法
                                    clip_new_version_2 = fitz.Rect(350, 115, 570, 200)
                                    text_new_version_1 = page.get_text(clip=clip_new_version_2).strip()
                                    rate_2 = text_new_version_1.split('\n')[0].strip()
                                # 如果出現任何錯誤，設置rate_2為None。
                                except:
                                    rate_2 = None

                            # 檢查兩種方法提取的評價是否相同
                            if rate_1 == rate_2:
                                if rate_1 == None:
                                    rate = 'NULL'
                                else:
                                    rate = rate_1
                            else:
                                if rate_1 in possible_ans:
                                    rate = rate_1
                                elif rate_2 in possible_ans:
                                    rate = rate_2
                                else :
                                    rate = 'NULL'
                        else:
                            rate = 'NULL'
                    else:
                        rate = 'NULL'
                except:
                    rate = 'NULL'
        except:
            rate = 'NULL'
        return rate


class FileHandle():
    """Handle pdf file
    """
    def __init__(self) -> None:
        self._unhandle_path = f"{root_path['UNZIP_PATH']}/{datetime.datetime.now().strftime('%Y%m%d')}"
        self._ER = ExtractPdfRate()

    def _handle_1_dir(self) -> None:
        """Handle directory 1 (gmail handled)

            Args :
                None
            
            Return :
                None
        """
        dir_path = f"{self._unhandle_path}/1"

        if not os.path.isdir(dir_path):
            print(f"{dir_path} is not exist", file = sys.stderr)
            return

        # Travse all file in directory 1
        for filename in tqdm(os.listdir(dir_path)):
            # 1216_統一_20230321_永豐投顧_NULL_受惠於內需增溫與殖利率題材.pdf
            info = filename.split("_")
            info[-1] = info[-1].replace(".pdf", "")

            if info[4] != "NULL":
                continue

            new_rate = "NULL"

            if '永豐' in info[3]:
                new_rate = self._ER.sino_pac(f"{dir_path}/{filename}")
                info[3] = "永豐投顧"

            elif '國票' in info[3]:
                new_rate = self._ER.ibf(f"{dir_path}/{filename}")
                info[3] = "國票"

            elif 'CTBC' or '中信' in info[3]:
                new_rate = self._ER.ctbc(f"{dir_path}/{filename}")
                info[3] = "CTBC"

            new_filename = f"{info[0]}_{info[1]}_{info[2]}_{info[3]}_{new_rate}_{info[5]}.pdf"

            os.rename(f"{dir_path}/{filename}", f"{dir_path}/{new_filename}")
    
    def _handle_2_dir(self) -> None:
        """Handle directory 2 (gmail cannot handle and line)

            Args :
                None
            
            Return :
                None
        """
        dir_path = f"{self._unhandle_path}/2"

        if not os.path.isdir(dir_path):
            print(f"{dir_path} is not exist", file = sys.stderr)
            return
        
        # Travse all file in directory 2
        for filename in tqdm(os.listdir(dir_path)):
            # 2727王品 永豐.pdf
            info = filename.split(" ")
            info[-1] = info[-1].replace(".pdf", "")

            new_rate = "NULL"

            if '永豐' in info[1]:
                new_rate = self._ER.sino_pac(f"{dir_path}/{filename}")
                info[1] = "永豐投顧"
                
            elif '國票' in info[1]:
                new_rate = self._ER.ibf(f"{dir_path}/{filename}")
                info[1] = "國票"

            elif 'CTBC' or '中信' in info[1]:
                new_rate = self._ER.ctbc(f"{dir_path}/{filename}")
                info[1] = "CTBC"

            new_filename = f"{info[0][:4]}_{info[0][4:]}_{datetime.datetime.now().strftime('%Y%m%d')}_{info[1]}_{new_rate}_NULL.pdf"

            os.rename(f"{dir_path}/{filename}", f"{dir_path}/{new_filename}")
    
    def run(self) -> None:
        """Run

            Args :
                mode : (str) mode

            Return :
                None
        """
        print("Handle 1 dir ...", file = sys.stderr)
        self._handle_1_dir()

        print("Handle 2 dir ...", file = sys.stderr)
        self._handle_2_dir()

if __name__ == "__main__":
    sys.stderr = open(root_path["GMAIL_DATA_LOG_PATH"] + f"/file_handle_{str(datetime.datetime.now())}.log", 'w')
    FH = FileHandle()
    update_2_sql = Update2SQL()

    FH.run()

    print("Update data to sql...", file = sys.stderr)
    update_2_sql.run(f"{root_path['UNZIP_PATH']}/{datetime.datetime.now().strftime('%Y%m%d')}/1")