import MySQLdb
import MySQLdb.cursors
import json
import threading
import time

db_config = json.load(open("../../../db_config.json"))

class DataBaseManager():
    def __init__(self) -> None:
        self.db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self.cursor = self.db.cursor()
        t = threading.Thread(target = self._ping_db)
        t.start()

    def _ping_db(self) -> None:
        while True:
            self.db.ping(True)
            time.sleep(60 * 60)
        