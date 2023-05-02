from email.mime.multipart import MIMEMultipart
import smtplib
from .constant import *
import datetime
import json

class GmailService():
    def __init__(self) -> None:
        self._root_path = json.load(open("/home/uikai/financialSite/root_path.json"))

    def create_smtp(self, content : MIMEMultipart) -> None:
        # 設定SMTP伺服器
        with smtplib.SMTP(host = SMTP_HOST, port = SMTP_PORT) as smtp:
            try:
                # 驗證SMTP伺服器
                smtp.ehlo()
                # 建立加密傳輸
                smtp.starttls()
                # 登入寄件者gmail
                smtp.login(GMAIL_ACCOUNT, GMAIL_AUTH)
                # 寄送郵件
                smtp.send_message(content)

            except smtplib.SMTPRecipientsRefused as e:
                with open(self._root_path["SMTP_LOG_PATH"] + "/" + str(datetime.date.today()) + '.log', 'a') as f:
                    f.write(str(e))