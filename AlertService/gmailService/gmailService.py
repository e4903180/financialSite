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

if __name__ == "__main__":
    GS = GmailService()

    content = MIMEMultipart()  #建立MIMEMultipart物件
    content["subject"] = "天花板地板線分析報告"  #郵件標題
    content["from"] = GMAIL_ACCOUNT  #寄件者
    content["to"] = "leo4707@gmail.com" #收件者
    content.attach(MIMEText("附件為您在我們網站訂閱的內容"))  #郵件內容

    with open("./pdf/GFG.pdf", "rb") as f:
        pdf_attach = MIMEApplication(f.read(), _subtype = "pdf", Name = 'GFG.pdf')

    content.add_header('content-disposition', 'attachment')
    content.attach(pdf_attach)

    GS.send_mail(content)