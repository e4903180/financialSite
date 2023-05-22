import MySQLdb
import MySQLdb.cursors
from datetime import date
import pandas as pd
import sys
import json

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService

class SubExpire():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def detect(self) -> None:
        sql = f'SELECT `ID` FROM subscribe WHERE endTime="{date.today()}"'
        self._cursor.execute(sql)
        self._db.commit()
        expire_sub = pd.DataFrame.from_dict(self._cursor.fetchall())

        for i in range(len(expire_sub)):
            sql = f'DELETE FROM subscribe WHERE `ID`={expire_sub["ID"][i]}'
            self._cursor.execute(sql)
            self._db.commit()

if __name__ == "__main__":
    log_path = f"{root_path['SUBEXPIRE_LOG_PATH']}/{str(date.today())}.log"
    
    log_notify_service = LogNotifyService()
    SE = SubExpire()

    sys.stderr = open(log_path, 'w')

    try:
        SE.detect()
    except Exception as e:
        print(e, file = sys.stderr)
        log_notify_service.send_email("訂閱更新狀態", log_path)