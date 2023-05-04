import json
import datetime
import os
import sys
import configparser
from tqdm import tqdm
from extractPdfRate import ExtractPdfRate
from update2SQL import Update2SQL
from typing import Dict, List

config = configparser.ConfigParser()
config.read('../../LineBot/config.ini')

root_path = json.load(open("../../root_path.json"))
recommend_json = json.load(open("../../recommend.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService

class FileHandle():
    """Handle pdf file
    """
    def __init__(self) -> None:
        self._unhandle_path = f"{root_path['UNZIP_PATH']}/{datetime.datetime.now().strftime('%Y%m%d')}"
        self._ER = ExtractPdfRate()

        self._recommend_pattern = {
            "buy" : recommend_json["buy"],
            "hold" : recommend_json["hold"],
            "sell" : recommend_json["sell"],
            "interval" : recommend_json["interval"]
        }

        # funtion pointer and mapping investment company
        self._handle_method = {
            "永豐" : [self._ER.sinopac, "永豐投顧"],
            "永豐投顧" : [self._ER.sinopac, "永豐投顧"],
            "國票" : [self._ER.ibf, "國票投顧"],
            "CTBC" : [self._ER.ctbc, "CTBC"],
            "中信託" : [self._ER.ctbc, "CTBC"],
            "富邦" : [self._ER.fubon, "富邦"],
            "元大" : [self._ER.yuanta, "元大"],
            "宏遠" : [self._ER.honsec, "宏遠"],
            "台新" : [self._ER.taishin, "台新投顧"],
            "統一" : [self._ER.pscnet, "統一投顧"],
            "群益" : [self._ER.capital, "群益"],
            "元富" : [self._ER.masterlink, "元富"],
            "第一金" : [self._ER.ffhc, "第一金"],
            "日盛" : [self._ER.jihsun, "日盛"],
            "玉山" : [self._ER.esun, "玉山投顧"],
            "國泰" : [self._ER.cathay, "國泰"],
            "兆豐" : [self._ER.mega, "兆豐"],
            "福邦" : [self._ER.gfortune, "福邦"],
            "康和" : [self._ER.concords, "康和"],
            "MS" : [self._ER.morganstanley, "MS"],
            "city" : [self._ER.citi, "city"],
            "里昂" : [self._ER.clsa, "里昂"],
            "高盛" : [self._ER.goldmansachs, "GS"],
            "HSBC" : [self._ER.hsbc, "HSBC"],
            "摩根大通" : [self._ER.jpmorgan, "摩根大通"],
            "野村" : [self._ER.nomura, "野村"],
        }

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

            if ((info[4] != "NULL") or
                (info[3] == "NULL")):
                continue

            result = self._recommend_extract(info, 3, dir_path, filename)
            info = result["info"]

            self._new_recommend_notify(result['new_rate'])
            
            new_filename = f"{info[0]}_{info[1]}_{info[2]}_{info[3]}_{result['new_rate']}_{info[5]}.pdf"

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
            if filename.count(" ") != 1:
                os.rename(f"{dir_path}/{filename}", f"{dir_path[:-2]}/{filename}")
                continue

            info = filename.split(" ")
            info[-1] = info[-1].replace(".pdf", "")

            result = self._recommend_extract(info, 1, dir_path, filename)
            info = result["info"]

            new_filename = f"{info[0][:4]}_{info[0][4:]}_{datetime.datetime.now().strftime('%Y%m%d')}_{info[1]}_{result['new_rate']}_NULL.pdf"
            self._new_recommend_notify(new_filename)

            os.rename(f"{dir_path}/{filename}", f"{dir_path}/{new_filename}")
    
    def _recommend_extract(self, info : List, investment_company_ptr : int, dir_path : str, filename : str) -> Dict:
        new_rate = "NULL"

        if info[investment_company_ptr] in self._handle_method:
            temp = self._handle_method[info[investment_company_ptr]]
            new_rate = temp[0](f"{dir_path}/{filename}")
            info[investment_company_ptr] = temp[1]

        return {"info" : info, "new_rate" : new_rate}

    def _new_recommend_notify(self, new_filename : str) -> None:
        for key in self._recommend_pattern:
            if new_filename in self._recommend_pattern[key]:
                return
        
        print(f"{new_filename} is new", file = sys.stderr)

    def run(self, mode : str) -> None:
        """Run

            Args :
                mode : (int) handle which dir

            Return :
                None
        """        
        if mode == "1":
            print("Handle 1 dir ...", file = sys.stderr)
            self._handle_1_dir()

        elif mode == "2":
            print("Handle 2 dir ...", file = sys.stderr)
            self._handle_2_dir()

if __name__ == "__main__":
    # If u want to handle line research, u have to switch argv[1] to "2"
    if sys.argv[1] == "2":
        log_path = f"{root_path['GMAIL_DATA_LOG_PATH']}/line_handle_{str(datetime.datetime.now())}.log"
        sys.stderr = open(log_path, 'w')

        log_notify_service = LogNotifyService()
        file_handle = FileHandle()
        update_2_sql = Update2SQL()
        
        try:
            print("Handle recommend...", file = sys.stderr)
            file_handle.run(sys.argv[1])

            print("Update data to sql...", file = sys.stderr)
            update_2_sql.run(f"{root_path['UNZIP_PATH']}/{datetime.datetime.now().strftime('%Y%m%d')}/2")
        except:
            log_notify_service.send_email("Line個股研究報告更新狀態",log_path)