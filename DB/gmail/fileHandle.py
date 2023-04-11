import json
import datetime
import os
import sys
from tqdm import tqdm
from extractPdfRate import ExtractPdfRate
from update2SQL import Update2SQL

root_path = json.load(open("../../root_path.json"))

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
                new_rate = self._ER.sinopac(f"{dir_path}/{filename}")
                info[3] = "永豐投顧"

            elif '國票' in info[3]:
                new_rate = self._ER.ibf(f"{dir_path}/{filename}")
                info[3] = "國票"

            elif (('CTBC' in info[3]) or 
                  ('中信' in info[3])):
                new_rate = self._ER.ctbc(f"{dir_path}/{filename}")
                info[3] = "CTBC"
            
            elif "富邦" in info[3]:
                new_rate = self._ER.fubon(f"{dir_path}/{filename}")
                info[3] = "富邦"

            elif "元大" in info[3]:
                new_rate = self._ER.yuanta(f"{dir_path}/{filename}")
                info[3] = "元大"
            
            elif "宏遠" in info[3]:
                new_rate = self._ER.honsec(f"{dir_path}/{filename}")
                info[3] = "宏遠"

            elif "台新" in info[3]:
                new_rate = self._ER.taishin(f"{dir_path}/{filename}")
                info[3] = "台新投顧"
            
            elif "統一" in info[3]:
                new_rate = self._ER.pscnet(f"{dir_path}/{filename}")
                info[3] = "統一投顧"
            
            elif "群益" in info[3]:
                new_rate = self._ER.capital(f"{dir_path}/{filename}")
                info[3] = "群益"
            
            elif "元富" in info[3]:
                new_rate = self._ER.masterlink(f"{dir_path}/{filename}")
                info[3] = "元富"

            elif "第一金" in info[3]:
                new_rate = self._ER.ffhc(f"{dir_path}/{filename}")
                info[3] = "第一金"

            elif "日盛" in info[3]:
                new_rate = self._ER.jihsun(f"{dir_path}/{filename}")
                info[3] = "日盛"

            elif "玉山" in info[3]:
                new_rate = self._ER.esun(f"{dir_path}/{filename}")
                info[3] = "玉山"
            
            elif "國泰" in info[3]:
                new_rate = self._ER.cathay(f"{dir_path}/{filename}")
                info[3] = "國泰"

            elif "兆豐" in info[3]:
                new_rate = self._ER.mega(f"{dir_path}/{filename}")
                info[3] = "兆豐"
            
            elif "福邦" in info[3]:
                new_rate = self._ER.gfortune(f"{dir_path}/{filename}")
                info[3] = "福邦"

            elif "康和" in info[3]:
                new_rate = self._ER.concords(f"{dir_path}/{filename}")
                info[3] = "康和"

            new_filename = f"{info[0]}_{info[1]}_{info[2]}_{info[3]}_{new_rate}_{info[5]}.pdf"

            os.rename(f"{dir_path}/{filename}", f"{dir_path}/{new_filename}")
    
    def _handle_2_dir(self) -> None:
        """Handle directory 2 (gmail cannot handle and line)

            Args :
                None
            
            Return :
                None
        """
        dir_path = f"{root_path['UNZIP_PATH']}/{(datetime.datetime.now() - datetime.timedelta(days = 1)).strftime('%Y%m%d')}/2"

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
                new_rate = self._ER.sinopac(f"{dir_path}/{filename}")
                info[1] = "永豐投顧"
                
            elif '國票' in info[1]:
                new_rate = self._ER.ibf(f"{dir_path}/{filename}")
                info[1] = "國票"

            elif (('CTBC' in info[1]) or
                  ('中信' in info[1])):
                new_rate = self._ER.ctbc(f"{dir_path}/{filename}")
                info[1] = "CTBC"

            elif "富邦" in info[1]:
                new_rate = self._ER.fubon(f"{dir_path}/{filename}")
                info[1] = "富邦"
            
            elif "元大" in info[1]:
                new_rate = self._ER.yuanta(f"{dir_path}/{filename}")
                info[1] = "元大"

            elif "宏遠" in info[1]:
                new_rate = self._ER.honsec(f"{dir_path}/{filename}")
                info[1] = "宏遠"
            
            elif "台新" in info[1]:
                new_rate = self._ER.taishin(f"{dir_path}/{filename}")
                info[1] = "台新投顧"
            
            elif "統一" in info[1]:
                new_rate = self._ER.pscnet(f"{dir_path}/{filename}")
                info[1] = "統一投顧"
            
            elif "群益" in info[1]:
                new_rate = self._ER.capital(f"{dir_path}/{filename}")
                info[1] = "群益"
            
            elif "元富" in info[1]:
                new_rate = self._ER.masterlink(f"{dir_path}/{filename}")
                info[1] = "元富"
            
            elif "第一金" in info[1]:
                new_rate = self._ER.ffhc(f"{dir_path}/{filename}")
                info[1] = "第一金"
            
            elif "日盛" in info[1]:
                new_rate = self._ER.jihsun(f"{dir_path}/{filename}")
                info[1] = "日盛"

            elif "玉山" in info[1]:
                new_rate = self._ER.esun(f"{dir_path}/{filename}")
                info[1] = "玉山"
            
            elif "國泰" in info[1]:
                new_rate = self._ER.cathay(f"{dir_path}/{filename}")
                info[1] = "國泰"
            
            elif "兆豐" in info[1]:
                new_rate = self._ER.mega(f"{dir_path}/{filename}")
                info[1] = "兆豐"
            
            elif "福邦" in info[1]:
                new_rate = self._ER.gfortune(f"{dir_path}/{filename}")
                info[1] = "福邦"

            elif "康和" in info[1]:
                new_rate = self._ER.concords(f"{dir_path}/{filename}")
                info[1] = "康和"

            new_filename = f"{info[0][:4]}_{info[0][4:]}_{datetime.datetime.now().strftime('%Y%m%d')}_{info[1]}_{new_rate}_NULL.pdf"

            os.rename(f"{dir_path}/{filename}", f"{dir_path}/{new_filename}")
    
    def run(self, mode : int) -> None:
        """Run

            Args :
                mode : (int) handle which dir

            Return :
                None
        """        
        if mode == 1:
            print("Handle 1 dir ...", file = sys.stderr)
            self._handle_1_dir()

        elif mode == 2:
            print("Handle 2 dir ...", file = sys.stderr)
            self._handle_2_dir()

if __name__ == "__main__":
    sys.stderr = open(root_path["GMAIL_DATA_LOG_PATH"] + f"/line_handle_{str(datetime.datetime.now())}.log", 'w')
    
    file_handle = FileHandle()

    if sys.argv[1] == 2:
        update_2_sql = Update2SQL()
        
        print("Handle recommend...", file = sys.stderr)
        file_handle.run(int(sys.argv[1]))

        print("Update data to sql...", file = sys.stderr)
        update_2_sql.run(f"{root_path['UNZIP_PATH']}/{datetime.datetime.now().strftime('%Y%m%d')}/2")