import pandas as pd
import datetime
from typing import Dict

class Inflation():
    """Get the inflation data from DB
        1. CPI => Consumer Price Index
        2. FED => Federal Funds Effective Rate
        3. AHE => Average Hourly Earnings of All Employees
        4. JNK => SPDR Bloomberg High Yield Bond ETF
        5. DXY => US Dollar/USDX - Index – Cash
    """

    def __init__(self, db, cursor) -> None:
        self._db = db
        self._cursor = cursor

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

    def get_data(self) -> Dict:
        """Get data

            Args:
                None

            Return:
                result : (Dict) CPI, FED, AHE, JNK, DXY data
        """
        self._get_CPI()
        self._get_FED()
        self._get_AHE()
        self._get_JNK()
        self._get_DXY()

        result = {
            "CPI" : self.CPI_data,
            "FED" : self.FED_data,
            "AHE" : self.AHE_data,
            "JNK" : self.JNK_data,
            "DXY" : self.DXY_data,
            "AHERangeData" : [[i[0], 3.5, 4.0] for i in self.AHE_data]
        }

        return result

    def _query_data(self, table_name : str, column : str) -> pd.DataFrame:
        """Query data from DB

            Args:
                table_name : (str) table name
                column : (str) column name
            
            Return:
                pd.DataFrame
        """
        self._cursor.execute(f"SELECT `date`, `{column}` FROM {table_name}")
        self._db.commit()

        return pd.DataFrame.from_dict(self._cursor.fetchall())

    def _transform_to_ms(self, data : pd.DataFrame) -> list:
        """In order to fitting highchart format, transform date to millisecond 

            Args:
                data : (pd.DataFrame) row data
            
            Return:
                List
        """
        epoch = datetime.datetime.utcfromtimestamp(0)
        
        return [[(datetime.datetime.strptime(data.iloc[idx][0], "%Y-%m-%d") - epoch).total_seconds() * 1000.0, data.iloc[idx][1]] for idx in range(len(data))]

    def _get_CPI(self) -> None:
        """Get CPI data

            Args:
                None
            Return:
                None
        """
        self.CPI_table_data = self._query_data("CPI", "CPI")
        
        self.CPI_data = self._transform_to_ms(self.CPI_table_data)
    
    def _get_FED(self) -> None:
        """Get FED data

            Args:
                None
            Return:
                None
        """
        self.FED_table_data = self._query_data("FED", "FED")
        
        self.FED_data = self._transform_to_ms(self.FED_table_data)

    def _get_AHE(self) -> None:
        """Get AHE data

            Args:
                None
            Return:
                None
        """
        self.AHE_table_data = self._query_data("AHE", "AHE")
        
        self.AHE_data = self._transform_to_ms(self.AHE_table_data)

    def _get_DXY(self) -> None:
        """Get DXY data

            Args:
                None
            Return:
                None
        """
        self.DXY_table_data = self._query_data("DXY", "Close")
        
        self.DXY_data = self._transform_to_ms(self.DXY_table_data)

    def _get_JNK(self) -> None:
        """Get JNK data

            Args:
                None
            Return:
                None
        """
        self.JNK_table_data = self._query_data("JNK", "Close")
        
        self.JNK_data = self._transform_to_ms(self.JNK_table_data)