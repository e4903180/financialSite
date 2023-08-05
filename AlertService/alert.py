from utils.SupportResistanceHandler import SupportResistanceHandler
from utils.PerRiverHandler import PerRiverHandler
from utils.StockPriceDecisionHandler import StockPriceDecisionHandler
from gmailService.constant import GMAIL_ACCOUNT
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from pdfMaker import PdfMaker
import pandas as pd
from linebot import LineBotApi
from linebot.models import TextSendMessage
import configparser
import MySQLdb
import MySQLdb.cursors
import os
from gmailService.gmailService import GmailService
import datetime
import sys
import json

db_config = json.load(open("../db_config.json"))
root_path = json.load(open("../root_path.json"))

sys.path.append(root_path["PROJECT_ROOT_PATH"])
from LogNotifyService.logNotifyService import LogNotifyService

class AlertService():
    """Create the analysis research by user's subscribe settings,
        and notify by line or email
    """

    def __init__(self) -> None:
        self._GS = GmailService()
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

        config = configparser.ConfigParser()
        config.read('../LineBot/config.ini')

        self._line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))
    
    def _init_dir(self) -> None:
        """Clear the image, pdf and html directory

            Args :
                None

            Return :
                None
        """
        for file in os.listdir(root_path["ALTERSERVICE_HTML_PATH"]):
            os.remove(root_path["ALTERSERVICE_HTML_PATH"] + "/" + file)

        for file in os.listdir(root_path["ALTERSERVICE_IMAGE_PATH"]):
            os.remove(root_path["ALTERSERVICE_IMAGE_PATH"] + "/" + file)

        for file in os.listdir(root_path["ALTERSERVICE_PDF_PATH"]):
            os.remove(root_path["ALTERSERVICE_PDF_PATH"] + "/" + file)

    def _get_sub_list(self) -> pd.DataFrame:
        """Get subscribe list from DB

            Args :
                None

            Return :
                None
        """

        sql = f'SELECT subscribe.ID, subscribe.username, ticker_list.stock_num, subscribe.endTime, subscribe.subTime, \
            subscribe.content, subscribe.strategy, subscribe.alertCondition \
            FROM subscribe INNER JOIN ticker_list ON subscribe.ticker_id=ticker_list.ID'
        self._cursor.execute(sql)
        self._db.commit()

        return pd.DataFrame.from_dict(self._cursor.fetchall())
    
    def _get_user(self) -> pd.DataFrame:
        """Get user list from DB

            Args :
                None

            Return :
                None
        """

        sql = 'SELECT userName, email, lineId, emailNotify, lineNotify FROM user'
        self._cursor.execute(sql)
        self._db.commit()

        return pd.DataFrame.from_dict(self._cursor.fetchall())

    def _send_by_mail(self, subject : str, username : str, email : str) -> None:
        """Send the analysis research through gmail service

            Args :
                subject : (str) subject of the mail
                username : (str) username
                email : (str) user's email

            Return :
                None
        """

        content = MIMEMultipart()
        content["subject"] = subject
        content["from"] =  GMAIL_ACCOUNT
        content["to"] = email
        content.attach(MIMEText(f"附件為您在我們網站訂閱的內容\n可互動圖表連結在此，連結有效時間為一天\n"))
        content.attach(MIMEText(f'<a href="https://cosbi5.ee.ncku.edu.tw/api2/analysis_html_download?filename={username}.html" \
                                target="_blank" rel="noreferrer noopener" download="{username}.html">\
                                https://cosbi5.ee.ncku.edu.tw/api2/analysis_html_download?filename={username}.html\
                                </a>', _subtype = "html"))
        content.attach(MIMEText(f"\n如遇到連結無法正常開啟，請複製連結到新分頁再開啟"))

        with open(f"{root_path['ALTERSERVICE_PDF_PATH']}/{username}-分析報告.pdf", "rb") as f:
            pdf_attach = MIMEApplication(f.read(), _subtype = "pdf", Name = username + '-分析報告.pdf')

        content.add_header('content-disposition', 'attachment')
        content.attach(pdf_attach)

        self._GS.send_mail(content)

    def _send_by_line(self, filename : str, username : str, userId : str) -> None:
        """Send the analysis research through line service

            Args :
                filename : (str) analysis research filename
                username : (str) username
                userId : (str) user's line Id

            Return :
                None
        """

        content = "FinancialCosbi 分析報告通知\n詳情請下載分析報告\n檔案只會保持一天請下載以保留\n"
        content += f"https://cosbi5.ee.ncku.edu.tw/api2/analysis_download?filename={filename}"
        self._line_bot_api.push_message(userId, TextSendMessage(text = content))

        content = f"可互動圖表下載\nhttps://cosbi5.ee.ncku.edu.tw/api2/analysis_html_download?filename={username}.html"
        self._line_bot_api.push_message(userId, TextSendMessage(text = content))

    def run(self) -> None:
        """Traverse subscribe list, creating analysis research and send to the user

            Args :
                None

            Return :
                None
        """

        # Init html, image and pdf directory
        self._init_dir()

        # Get subscribe list
        sub_list = self._get_sub_list()
        
        # If suscribe list is empty, then return
        if sub_list.empty:
            return

        # Get user list
        user_list = self._get_user()

        # Traverse all user
        for i in range(len(user_list)):
            username = user_list.iloc[i]["userName"]
            subsribe = sub_list[sub_list["username"] == username]

            if len(subsribe) == 0:
                continue
            
            # Check if user subscribe exist
            pdfMaker = PdfMaker(username)
            support_resistance_handler = SupportResistanceHandler(pdfMaker)
            per_river_handler = PerRiverHandler(pdfMaker)
            stock_price_decision_handler = StockPriceDecisionHandler(pdfMaker)

            # Create research html
            with open(f"{root_path['ALTERSERVICE_HTML_PATH']}/{username}.html", "w") as f:
                f.write('<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" \
                        rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" \
                        crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" \
                        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" \
                        crossorigin="anonymous"></script></head><body>')

                # Traverse user's subscribe
                for j in range(len(subsribe)):
                    temp = subsribe.iloc[j]
                
                    if temp["strategy"] == "天花板地板線":
                        support_resistance_handler.handle_support_resistance(temp, f)

                    elif temp["strategy"] == "本益比河流圖":
                        per_river_handler.handle_per_river(temp, f)

                    elif temp["strategy"] == "股票定價策略":
                        stock_price_decision_handler.handle_stock_pricing_decision(temp, f)

                # Add html end
                f.write("</body></html>")

            # Create research pdf
            pdfMaker.output()

            # If email notify is true, using gmail service
            if user_list.iloc[i]["emailNotify"]:
                self._send_by_mail("FinancialCosbi 分析報告通知",
                                    username,
                                    user_list.iloc[i]["email"])

            # If line notify is true, using line service
            if user_list.iloc[i]["lineNotify"]:
                self._send_by_line(username + '-分析報告.pdf',
                                    username,
                                    user_list.iloc[i]["lineId"])

if __name__ == "__main__":
    log_path = f"{root_path['ALTERSERVICE_LOG_PATH']}/{str(datetime.datetime.now())}.log"
    sys.stderr = open(log_path, 'w')

    log_notify_service = LogNotifyService()
    alert_service = AlertService()

    try:
        alert_service.run()
    except Exception as e:
        log_notify_service.send_email("警示更新狀態", str(e))