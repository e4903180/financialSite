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
        # Prevent some bugs cause log file doesn't exist
        if not os.path.exists(log_path):
            return
        
        content = MIMEMultipart()
        content["subject"] = subject
        content["from"] =  GMAIL_ACCOUNT
        content["to"] = ADDMIN_EMAIL

        temp = ""
        with open(log_path, "r") as f:
            for line in f:
                temp += f"{line}\n"
        
        content.attach(MIMEText(temp))
        self._gmail_service.create_smtp(content)