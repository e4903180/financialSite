from .gmailService.gmailService import GmailService
from .gmailService.constant import GMAIL_ACCOUNT, ADDMIN_EMAIL
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class LogNotifyService():
    """Notify addmin about db update
    """
    def __init__(self) -> None:
        self._gmail_service = GmailService()

    def send_email(self, subject : str, error_message : str) -> None:
        """Send db update status to addmin

            Args :
                subject : (str) subject of email
                error_message : (str) error message

            Return :
                None
        """
        content = MIMEMultipart()
        content["subject"] = subject
        content["from"] =  GMAIL_ACCOUNT
        content.attach(MIMEText(error_message))
        
        for email in ADDMIN_EMAIL:
            content["to"] = email
            self._gmail_service.create_smtp(content)