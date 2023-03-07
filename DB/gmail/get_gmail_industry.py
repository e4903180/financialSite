from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os
import pickle
from tqdm import tqdm
from typing import List, Dict
import base64
import time
import pandas as pd
import MySQLdb
import MySQLdb.cursors
import sys
import datetime
import json

db_config = json.load(open("../../db_config.json"))
root_path = json.load(open("../../root_path.json"))

class GetGmailIndustry():
    def __init__(self) -> None:
        # Define the SCOPES. If modifying it, delete the token.pickle file.
        self._SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        self._creds = self.getCreds()
        # Connect to the Gmail API
        self._service = build('gmail', 'v1', credentials = self._creds)
        self._monthMap = { "Jan" : "01", "Feb" : "02", "Mar" : "03", "Apr" : "04", "May" : "05", "Jun" : "06",
           "Jul" : "07", "Aug" : "08", "Sep" : "09", "Oct" : "10", "Nov" : "11", "Dec" : "12" }
        self._rootPath = root_path["GMAIL_DATA_INDUSTRY_DATA_PATH"]
        self._investment_company = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", 
            index_col = 0, names = ['name'], sheet_name = 1).to_dict(orient = 'dict')['name']
        self._db = MySQLdb.connect(host = db_config["HOST"], user = db_config["USER"], passwd = db_config["PASSWD"],
                    db = "financial", charset = "utf8", cursorclass = MySQLdb.cursors.DictCursor)
        self._cursor = self._db.cursor()

    def getCreds(self) -> None:
        """Get the token from google api before accesing gmail api
            
            Return:
                (String) creds
        """
        # Variable creds will store the user access token.
        # If no valid token found, we will create one.
        creds = None
        
        # The file token.pickle contains the user access token.
        # Check if it exists
        if os.path.exists('token.pickle'):

            # Read the token from the file and store it in the variable creds
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)

        # If credentials are not available or are invalid, ask the user to log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', self._SCOPES)
                creds = flow.run_local_server(port = 0)

            # Save the access token in token.pickle file for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
        return creds

    def _modifyLabels(self, id : str) -> None:
        """Modify mail from INBOX to Label_6431857565168172346
        
            Args:
                id: (String) The ID of the Message required
            Return:
                None
        """
        Body = { "addLabelIds": ["Label_6431857565168172346"], "removeLabelIds" : ["Label_3"] }
            
        self._service.users().messages().modify(userId = 'me', id = id, body = Body).execute()

    def _get_date_subject(self, headers : List) -> Dict:
        """Get the mail date
        
            Args:
                headers: (list) Header of the Message
            
            Return:
                (List) [Date, subject]
        """
        result = {}
        for header in headers:
            if header["name"] == "Subject":
                subject = header["value"].replace("轉寄: ", "")
                subject = subject.replace("Fwd: ", "")
                result["subject"] = subject

            elif header["name"] == "Date":
                date = self._date_format_transform(header["value"][5:-15])
                result["date"] = date
        return result
    
    def _date_format_transform(self, origin_date : str) -> str:
        """Transform data format from
            Fri, 10 Feb 2023 00:52:19 +0000 to
            2023-02-10

            Args :
                origin_date : (str) origin date format from mail
            Return :
                date : (str) already transormed date
        """
        temp = origin_date.split(" ")

        return f"{temp[2]}-{self._monthMap[temp[1]]}-{temp[0].zfill(2)}"

    def _get_investment_company(self, subject : str) -> str:
        """Find the investment company from subject

            Args :
                subject : (str) subject
            Return :
                If exist return investment company
                else "not found"
        """

        for key in self._investment_company.keys():
            if key in subject:
                return key
        
        return "not found"

    def _getAttachments(self, parts : List, id : str) -> str:
        """Get the mail attachments already existed in mail 
        
            Args:
                id : (str) mail id
            
            Return:
                filename : (str) filename
        """
        filename = ""

        for part in parts:
            if "application/pdf" in part['mimeType']:
                stop = False
                
                while not stop:
                    try:
                        att = self._service.users().messages().attachments().get(userId = 'me', messageId = id, id = part['body']['attachmentId']).execute()
                        file = att['data']
                        file_data = base64.urlsafe_b64decode(file.encode('UTF-8'))

                        with open(f"{self._rootPath}/{part['filename']}", 'wb') as f:
                            f.write(file_data)
                        
                        filename = part['filename']
                        stop = True
                    except Exception as e:
                        print(e)
                        time.sleep(1)
        
        return filename

    def _isDuplicate(self, date : str, investmentCompany : str, title : str, filename : str) -> bool:
        """Check if data is duplicate

            Args :
                date : (str) mail date
                investmentCompany : (str) mail investment company
                title : (str) mail title
                filename : (str) filename
            Return :
                bool
        """
        query = "SELECT * from financialDataIndustry WHERE date=%s AND investmentCompany=%s AND title=%s AND filename=%s;"

        param = (date, investmentCompany, title, filename)

        self._cursor.execute(query, param)
        self._db.commit()
        
        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True

    def _insert(self, date : str, investmentCompany : str, title : str, filename : str) -> None:
        """Insert data

            Args :
                date : (str) mail date
                investmentCompany : (str) mail investment company
                title : (str) mail title
                filename : (str) filename
            Return :
                None
        """
        query = "INSERT INTO financialDataIndustry (date, investmentCompany, title, filename) \
            VALUE (%s, %s, %s, %s);"

        param = (date, investmentCompany, title, filename)
        self._cursor.execute(query, param)
        self._db.commit()

    def _handle_mail(self, id : str) -> None:
        """Handle single mail

            Args :
                id : (str) mail id
            Return:
                None
        """
        details = self._service.users().messages().get(userId = 'me', id = id).execute()

        payload = details['payload']
        headers = payload['headers']

        result_subject_date = self._get_date_subject(headers)
        investmentCompany = self._get_investment_company(result_subject_date["subject"])

        if ((investmentCompany == "not found") or
            ("parts" not in payload)):
            return
        
        filename = self._getAttachments(payload['parts'][1:], id)

        if not self._isDuplicate(result_subject_date["date"], investmentCompany, result_subject_date["subject"], filename):
            self._insert(result_subject_date["date"], investmentCompany, result_subject_date["subject"], filename)

    def run(self) -> None:
        """Run

            Args :
                None
            Return :
                None
        """
        # request a list of all the messages
        result = self._service.users().messages().list(userId = 'me', maxResults = 500, labelIds = ["Label_3"]).execute()
        messages = result.get('messages')

        if messages == None:
            return
        
        for message in tqdm(messages):
            # handle mail details
            self._handle_mail(message["id"])

            # Modify labels to 已處理的無效郵件
            self._modifyLabels(message['id'])

if __name__ == "__main__":
    sys.stderr = open(root_path["GMAIL_DATA_INDUSTRY_LOG_PATH"] + "/" + str(datetime.datetime.now()) + '.log', 'w')
    GGI = GetGmailIndustry()

    GGI.run()