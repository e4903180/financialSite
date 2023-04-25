from email.mime.multipart import MIMEMultipart
import smtplib
from .constant import *
import datetime
import json

class GmailService():
    def __init__(self) -> None:
        self._root_path = json.load(open("../../../root_path.json"))

    def send_mail(self, content : MIMEMultipart) -> None:
        with smtplib.SMTP(host = SMTP_HOST, port = SMTP_PORT) as smtp:  # 設定SMTP伺服器
            try:
                smtp.ehlo()  # 驗證SMTP伺服器
                smtp.starttls()  # 建立加密傳輸
                smtp.login(GMAIL_ACCOUNT, GMAIL_AUTH)  # 登入寄件者gmail
                smtp.send_message(content)  # 寄送郵件

            except smtplib.SMTPRecipientsRefused as e:
                with open(self._root_path["SMTP_LOG_PATH"] + "/" + str(datetime.date.today()) + '.log', 'a') as f:
                    f.write(str(e))