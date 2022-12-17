import MySQLdb
import MySQLdb.cursors
import time
import threading

class DataBaseManager():
    def __init__(self) -> None:
        self.db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                        db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self.cursor = self.db.cursor()
        