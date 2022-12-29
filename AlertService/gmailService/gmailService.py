from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import smtplib
from .constant import *
import datetime

class GmailService():
    def __init__(self) -> None:
        pass

    def send_mail(self, content : MIMEMultipart) -> None:
        with smtplib.SMTP(host = SMTP_HOST, port = SMTP_PORT) as smtp:  # 設定SMTP伺服器
            try:
                smtp.ehlo()  # 驗證SMTP伺服器
                smtp.starttls()  # 建立加密傳輸
                smtp.login(GMAIL_ACCOUNT, GMAIL_AUTH)  # 登入寄件者gmail
                smtp.send_message(content)  # 寄送郵件

            except smtplib.SMTPRecipientsRefused as e:
                with open("/home/cosbi/桌面/financialData/SMTP/" + str(datetime.date.today()) + '.log', 'a') as f:
                    f.write(str(e))