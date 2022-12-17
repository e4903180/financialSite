import pandas as pd
import datetime
from typing import Dict

class CpiPpiPce():
    def __init__(self, db, cursor) -> None:
        self._db = db
        self._cursor = cursor

        self.CPI_data = None
        self.PPI_data = None
        self.PCE_data = None
        self.RPCEG_data = None
        self.UMCS_data = None

        self.CPI_table_data = None
        self.PPI_table_data = None
        self.PCE_table_data = None
        self.RPCEG_table_data = None
        self.UMCS_table_data = None
        self.TWII_table_data = None

    def get_data(self) -> Dict:
        self._get_CPI()
        self._get_PPI()
        self._get_PCE()
        self._get_RPCEG()
        self._get_UMCS()
        self._get_TWII()

        result = {
            "CPI" : self.CPI_data,
            "PPI" : self.PPI_data,
            "PCE" : self.PCE_data,
            "RPCEG" : self.RPCEG_data,
            "UMCS" : self.UMCS_data,
            "TWII" : self.TWII_table_data
        }

        return result

    def _query_data(self, table_name : str, column : str) -> pd.DataFrame:
        self._cursor.execute(f'SELECT `date`, `{column}` FROM {table_name} WHERE date>="2000-01-01"')
        self._db.commit()

        return pd.DataFrame.from_dict(self._cursor.fetchall())

    def _transform_to_ms(self, data : pd.DataFrame) -> list:
        epoch = datetime.datetime.utcfromtimestamp(0)
        
        return [[(datetime.datetime.strptime(data.iloc[idx][0], "%Y-%m-%d") - epoch).total_seconds() * 1000.0, data.iloc[idx][1]] for idx in range(len(data))]
    
    def _get_CPI(self) -> None:
        self.CPI_table_data = self._query_data("CPI", "CPI")
        
        self.CPI_data = self._transform_to_ms(self.CPI_table_data)

    def _get_PPI(self) -> None:
        self.PPI_table_data = self._query_data("PPI", "PPI")
        
        self.PPI_data = self._transform_to_ms(self.PPI_table_data)

    def _get_PCE(self) -> None:
        self.PCE_table_data = self._query_data("PCE", "PCE")
        
        self.PCE_data = self._transform_to_ms(self.PCE_table_data)

    def _get_RPCEG(self) -> None:
        self.RPCEG_table_data = self._query_data("RPCEG", "RPCEG")
        
        self.RPCEG_data = self._transform_to_ms(self.RPCEG_table_data)

    def _get_UMCS(self) -> None:
        self.UMCS_table_data = self._query_data("UMCS", "UMCS")
        
        self.UMCS_data = self._transform_to_ms(self.UMCS_table_data)

    def _get_TWII(self) -> None:
        self.TWII_table_data = self._query_data("TWII", "Close")

        self.TWII_table_data = self._transform_to_ms(self.TWII_table_data)