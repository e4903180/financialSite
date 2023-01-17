import MySQLdb
import MySQLdb.cursors
from datetime import date
import pandas as pd
import sys

class SubExpire():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
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
    SE = SubExpire()

    sys.stderr = open("/home/cosbi/桌面/financialData/SubExpire/" + str(date.today()) + '.log', 'w')
    SE.detect()