import os
from .gmailService.gmailService import GmailService
from .gmailService.constant import GMAIL_ACCOUNT, ADDMIN_EMAIL
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class LogNotifyService():
    """Notify addmin about db update
    """
    def __init__(self) -> None:
        self._gmail_service = GmailService()

    def send_email(self, subject : str, log_path : str) -> None:
        """Send db update status to addmin

            Args :
                subject : (str) subject of email
                log_path : (str) log path

            Return :
                None
        """
        if not os.path.exists(log_path):
            return
        
        content = MIMEMultipart()
        content["subject"] = subject
        content["from"] =  GMAIL_ACCOUNT
        content["to"] = ADDMIN_EMAIL

        with open(log_path, "r") as f:
            for line in f:
                content.attach(MIMEText(f"{line}\n"))

        self._gmail_service.send_mail(content)