import MySQLdb
import MySQLdb.cursors
import json
import pandas as pd
import sys
import datetime

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService

class TableStatus2CSV():
    """Create csv file of some table
    """
    def __init__(self) -> None:
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()
    
    def _calender2csv(self) -> None:
        """Create calender csv file

            Args : 
                None

            Return :
                None
        """
        query = "SELECT ticker_list.stock_num, ticker_list.stock_name, calender.date, calender.Time, \
                calender.Form, calender.Message, calender.chPDF, calender.enPDF, calender.More_information, \
                calender.Video_address, calender.Attention FROM calender INNER JOIN ticker_list ON \
                calender.ticker_id=ticker_list.ID ORDER BY date DESC"
        
        self._cursor.execute(query)
        self._db.commit()
        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/calender.csv", index = False)

    def _news2csv(self) -> None:
        """Create news csv file

            Args : 
                None
                
            Return :
                None
        """
        query = "SELECT * FROM news ORDER BY date DESC"

        self._cursor.execute(query)
        self._db.commit()

        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/news.csv", index = False)

    def _financial_data2csv(self) -> None:
        """Create financialData csv file

            Args : 
                None
                
            Return :
                None
        """
        query = "SELECT ticker_list.stock_num, ticker_list.stock_name, financialData.date, financialData.investmentCompany, \
                financialData.filename, financialData.recommend FROM financialData INNER JOIN ticker_list ON \
                financialData.ticker_id=ticker_list.ID ORDER BY date DESC"

        self._cursor.execute(query)
        self._db.commit()

        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/financialData.csv", index = False)
    
    def _financial_data_other2csv(self) -> None:
        """Create financialDataOther csv file

            Args : 
                None
                
            Return :
                None
        """
        query = "SELECT * FROM financialDataOther ORDER BY date DESC"

        self._cursor.execute(query)
        self._db.commit()

        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/financialDataOther.csv", index = False)
    
    def _financial_data_industry2csv(self) -> None:
        """Create financialDataIndustry csv file

            Args : 
                None
                
            Return :
                None
        """
        query = "SELECT * FROM financialDataIndustry ORDER BY date DESC"

        self._cursor.execute(query)
        self._db.commit()

        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/financialDataIndustry.csv", index = False)

    def _linememo2csv(self) -> None:
        """Create lineMemo csv file

            Args : 
                None
                
            Return :
                None
        """
        query = "SELECT ticker_list.stock_num, ticker_list.stock_name, lineMemo.date, lineMemo.filename, \
                lineMemo.inputTime, lineMemo.username FROM lineMemo INNER JOIN ticker_list ON \
                lineMemo.ticker_id=ticker_list.ID ORDER BY date DESC"

        self._cursor.execute(query)
        self._db.commit()

        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/linememo.csv", index = False)
    
    def _post_board_memo2csv(self) -> None:
        """Create post_board_memo csv file

            Args : 
                None
                
            Return :
                None
        """
        query = "SELECT ticker_list.stock_num, ticker_list.stock_name, post_board_memo.username, post_board_memo.date, \
                post_board_memo.evaluation, post_board_memo.price, post_board_memo.reason, post_board_memo.filename \
                FROM post_board_memo INNER JOIN ticker_list ON post_board_memo.ticker_id=ticker_list.ID \
                ORDER BY date DESC"

        self._cursor.execute(query)
        self._db.commit()

        pd.DataFrame.from_dict(self._cursor.fetchall()).to_csv(root_path["CSV_PATH"] + "/post_board_memo.csv", index = False)

    def run(self) -> None:
        """Run

            Args :
                None
            
            Return :
                None
        """
        self._calender2csv()
        self._news2csv()
        self._financial_data2csv()
        self._financial_data_other2csv()
        self._financial_data_industry2csv()
        self._linememo2csv()
        self._post_board_memo2csv()

if __name__ == "__main__":
    log_path = f"{root_path['CSV_LOG']}/{str(datetime.datetime.now())}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    table_status = TableStatus2CSV()

    try:
        table_status.run()
    except:
        log_notify_service.send_email("資料表CSV更新狀態", log_path)