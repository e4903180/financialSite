import pandas as pd
import datetime
import json
import sys
import MySQLdb
import MySQLdb.cursors
import yfinance as yf

class FRED():
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = "localhost", user = "debian-sys-maint", passwd = "CEMj8ptYHraxNxFt",
                                   db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        self.CPI_data = None
        self.FED_data = None
        self.AHE_data = None
        self.JNK_data = None
        self.DXY_data = None

        self.CPI_table_data = None
        self.FED_table_data = None
        self.AHE_table_data = None
        self.JNK_table_data = None
        self.DXY_table_data = None

    def get_data(self) -> None:
        self._get_CPI()
        self._get_FED()
        self._get_AHE()
        self._get_JNK()
        self._get_DXY()

    def _get_CPI(self) -> None:
        self._cursor.execute("SELECT `date`, `CPI` FROM CPI")
        self._db.commit()

        self.CPI_table_data = pd.DataFrame.from_dict(self._cursor.fetchall())
        
        self.CPI_data = self._transform_to_ms(self.CPI_table_data)
    
    def _get_FED(self) -> None:
        self._cursor.execute("SELECT `date`, `FED` FROM FED")
        self._db.commit()

        self.FED_table_data = pd.DataFrame.from_dict(self._cursor.fetchall())
        
        self.FED_data = self._transform_to_ms(self.FED_table_data)

    def _get_AHE(self) -> None:
        self._cursor.execute("SELECT `date`, `AHE` FROM AHE")
        self._db.commit()

        self.AHE_table_data = pd.DataFrame.from_dict(self._cursor.fetchall())
        
        self.AHE_data = self._transform_to_ms(self.AHE_table_data)
        
    def _transform_to_ms(self, data : pd.DataFrame) -> list:
        epoch = datetime.datetime.utcfromtimestamp(0)
        
        return [[(datetime.datetime.strptime(data.iloc[idx][0], "%Y-%m-%d") - epoch).total_seconds() * 1000.0, data.iloc[idx][1]] for idx in range(len(data))]

    def _get_DXY(self):
        self._cursor.execute("SELECT `date`, `Close` FROM DXY")
        self._db.commit()

        self.DXY_table_data = pd.DataFrame.from_dict(self._cursor.fetchall())
        self.DXY_data = self._transform_to_ms(self.DXY_table_data)

    def _get_JNK(self):
        self._cursor.execute("SELECT `date`, `Close` FROM JNK")
        self._db.commit()

        self.JNK_table_data = pd.DataFrame.from_dict(self._cursor.fetchall())
        self.JNK_data = self._transform_to_ms(self.JNK_table_data)

    def handle_to_json(self) -> json:
        json1 = json.loads(json.dumps({ "CPI" : self.CPI_data, "FED" : self.FED_data, "AHE" : self.AHE_data, "JNK" : self.JNK_data, "DXY" : self.DXY_data, "AHERangeData" : [[i[0], 3.5, 4.0] for i in self.AHE_data] }))
        json1 = json.dumps(json1)

        return json1

if __name__ == "__main__":
    fred = FRED()

    fred.get_data()

    print(fred.handle_to_json())
    sys.stdout.flush()