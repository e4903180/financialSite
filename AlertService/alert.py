# import sys
# sys.path.append("/home/cosbi/financialSite")

from utils.SupportResistanceHandler import SupportResistanceHandler
import pandas as pd
from linebot import LineBotApi
import configparser
# from pythonBackend.backend.api.PythonTool.StockPriceDecision import *
# from pythonBackend.backend.api.PythonTool.PER_River import PerRiver
import configparser
import MySQLdb
import MySQLdb.cursors
from typing import Dict

config = configparser.ConfigParser()
config.read('../LineBot/config.ini')

line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))

class AlertService(SupportResistanceHandler):
    def __init__(self) -> None:
        self.SRH = SupportResistanceHandler()

        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self._sub_list = None

        config = configparser.ConfigParser()
        config.read('../LineBot/config.ini')

        self.line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))

    def _get_sub_list(self) -> None:
        sql = 'SELECT * FROM subscribe'
        self._cursor.execute(sql)
        self._db.commit()

        self._sub_list = pd.DataFrame.from_dict(self._cursor.fetchall())

    def _get_email_lineId(self, username : str) -> Dict:
        sql = f'SELECT email, lineId FROM user WHERE userName="{username}"'
        self._cursor.execute(sql)
        self._db.commit()

        return self._cursor.fetchall()[0]

    def detect(self) -> None:
        self._get_sub_list()
        
        for i in range(len(self._sub_list)):
            temp = self._sub_list.iloc[i]
            email_line = self._get_email_lineId(temp["username"])

            if temp["strategy"] == "天花板地板線":
                self.SRH.handle_support_resistance(line_bot_api, temp, email_line)

            elif temp["strategy"] == "本益比河流圖":
                pass

            elif temp["strategy"] == "定價策略":
                pass

if __name__ == "__main__":
    AS = AlertService()

    AS.detect()