#!/usr/bin/env python
# coding: utf-8

# In[81]:


from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import base64
import email
from tqdm import trange
from bs4 import BeautifulSoup
import pandas as pd
import lxml
from apiclient import errors
import re
from datetime import datetime
import logging
import requests
from six.moves import urllib


# In[69]:


class Email:
    def __init__(self):
        # Define the SCOPES. If modifying it, delete the token.pickle file.
        self.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        self.creds = self.getCreds()
        # Connect to the Gmail API
        self.service = build('gmail', 'v1', credentials = self.creds)
        self.df_stock_num2name = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", index_col = 0, names = ['name'] , sheet_name = 0)
        self.df_investment_company = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", index_col = 0, names = ['name'], sheet_name = 1)
        self.dict_stock_num2name = self.df_stock_num2name.to_dict(orient = 'dict')['name']
        self.dict_investment_company = self.df_investment_company.to_dict(orient = 'dict')['name']
    
    def getCreds(self):
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
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', self.SCOPES)
                creds = flow.run_local_server(port=0)

            # Save the access token in token.pickle file for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
        return creds
    
    def getMessages(self, encodedData):
        """Get the mail messages
        
            Args:
                encodedData: (String) Encoded message data
            
            Return:
                If success
                    (html.parser) decoded_data
                If failed
                    (string) Null
        """

        try:
            data = encodedData.replace("-","+").replace("_","/")
            decoded_data = base64.b64decode(data)
            decoded_data = decoded_data.decode("utf-8")
            decoded_data = BeautifulSoup(decoded_data, 'html.parser')

            return decoded_data
        except:
            return "Null"
        
    def check_pdf_dir(self):
        """Create the file dir
        
        """
        
        if not os.path.isdir("file"):
            rootPath = os.path.abspath(os.getcwd())
            os.mkdir("file")
            
            for key, val in self.dict_stock_num2name.items():
                if not os.path.isdir(rootPath + "/file/" + str(key)):
                    os.mkdir(rootPath + "/file/" + str(key))
    
    def getAttachments(self, encodedFile, msgID, stock_num_name):
        """Get the mail attachments already existed in mail 
        
            Args:
                encodedFile: (dictionary) dictionary contains file base64
                stock_num_name: (dictionary) key is stock numbers and value is stock name
            
            Return:
                If success
                    (string) Stock numbers, (string) Stock name, (string) File path
                If failed
                    (string) Null, (string) Null, (string) Null
        """
        
        self.check_pdf_dir()
        
        fileName = encodedFile["filename"]
        
        if ".pdf" in fileName:
            for num, name in stock_num_name:
                if num in fileName:
                    try:
                        att = self.service.users().messages().attachments().get(userId = 'me', messageId = msgID, id = encodedFile['body']['attachmentId']).execute()
                        file = att['data']
                        file_data = base64.urlsafe_b64decode(file.encode('UTF-8'))

                        with open("./file/" + num + "/" + fileName, 'wb') as f:
                            f.write(file_data)

                        return num, name, "./file/" + num + "/" + fileName

                    except errors.HttpError:
                        print('An error occurred: %s' % error)
            return "null", "null", "null"
        else:
            return "null", "null", "null"
    
    def getAttachmentsURL(self, content, stock_num_name):
        """Get the attachments from url
        
            Args:
                content: (html.parser) Decoded message data
                stock_num_name: (dictionary) Key is stock numbers and value is stock name
            
            Return:
                If success
                    (string) Stock numbers, (string) Stock name, (string) File path
                If failed
                    (string) Null, (string) Null, (string) Null
        """
        
        self.check_pdf_dir()
        
        try:
            span_tags = content.find_all('a')
            for span in range(1, len(span_tags)):
                if re.findall(r"https://report.yuanta-consulting.com.tw/DL.aspx\?r\=\d{6}", span_tags[span].string):
                    try:
                        url = re.findall(r"https://report.yuanta-consulting.com.tw/DL.aspx\?r\=\d{6}", span_tags[span].string)
                        pdfurl = requests.get(url[0], allow_redirects = True).url
                        filename = urllib.parse.unquote(pdfurl.split("/")[-1])

                        for num, name in stock_num_name:
                            if num in str(filename):
                                file_rename = "./file/" + num + "/" + "元大_" + name + "_" + filename
                                urllib.request.urlretrieve(pdfurl, file_rename)
                                return num, name, file_rename
                    except:
                        print("link error")
                        return "null", "null", "null"
        except:
            a_tags = content.find_all('a', target = "_blank")
            
            for a in a_tags:
                if re.findall(r"http://www\.wls\.com\.tw/CancelLegal/.+Email=.+EpaperID=.+EpaperClassID=[a-zA-Z0-9\-]+",str(a)):
                    try:
                        url = re.findall(r"http://www\.wls\.com\.tw/CancelLegal/.+Email=.+EpaperID=.+EpaperClassID=[a-zA-Z0-9\-]+",str(a).replace("&amp;","&"))
                        checkpage = re.search(r'checkpage\d?', url[0]).group()
                        EpaperID = re.search(r'EpaperID=[a-zA-Z0-9\-]+', url[0]).group()
                        redirectURL = "http://www.wls.com.tw/CancelLegal/{}.aspx?EpaperID={}".format(
                            checkpage.replace("checkpage", "check"), EpaperID.replace("EpaperID=", ''))
                        pdfurl = requests.get(redirectURL, allow_redirects = True).url
                        filename = urllib.parse.unquote(pdfurl.split("/")[-1])
                        
                        for num, name in stock_num_name:
                            if str(num) in str(filename):
                                file_rename = "./file/" + num + "/" + name + "_" + filename
                                urllib.request.urlretrieve(pdfurl, file_rename)
                                return num, name, file_rename
                    except:            
                        print("link error")
                        return "null", "null", "null"
        return "null", "null", "null"
    
    def verifySubject(self, header, display = False):
        """Get the mail subject
        
            Args:
                header: (list) Header of the Message
                display: (bool) print subject or not
            
            Return:
                (Bool) True, False
        """
        
        for d in header:
            if d['name'] == 'Subject':
                if display:
                    print("Subject: ", d['value'])
                    print("-----" * 20)
                subject = d['value']
        
        # \d{4}(?=\.[A-Z] 4個數字(\d{4})但後面是 .加英文 EX:5288.TT
        # (?<=[^\d])\d{4}(?=[^\d\/]) 4個數字(\d{4}) 前面為非數字(?<=[^\d]) 後面不能接數字(\d) or/ or 年 or .
        temp1 = re.findall(r'\d{4}(?=\.[A-Z])', subject)
        temp2 = re.findall(r'^\d{4}(?=[^\d\/\年\.])|(?<=[^\d])\d{4}(?=[^\d\/\年\.])', subject)
        
        if len(temp1) != 0 and len(temp2) == 0:
            return temp1
        
        elif len(temp1) == 0 and len(temp2) != 0:
            return temp2
        
        else:
            return []
            
    def getDate(self, header, display = False):
        """Get the mail date
        
            Args:
                header: (list) Header of the Message
                display: (bool) print date or not
            
            Return:
                (String) Date
        """
        
        monthMap = { "Jan" : 1, "Feb" : 2, "Mar" : 3, "Apr" : 4, "May" : 5, "Jun" : 6,
           "Jul" : 7, "Aug" : 8, "Sep" : 9, "Oct" : 10, "Nov" : 11, "Dec" : 12 }
        
        for d in header:
            if d['name'] == 'Date':
                date = d['value'][5:]
                date = date.replace(" ", ",")
                temp = date.split(",")
                day = temp[0].zfill(2)
                month = str(monthMap[temp[1]])
                year = temp[2]

                date = year + "_" + month + "_" + day
                
                if display:
                    print("Date: ", date)
                    print("-----" * 20)
                return date
    
    def getResearch_report(self, subject, payload, id):
        """Get the research report
            Args:
                header: (list) Header of the Message
                display: (bool) print date or not

            Return:
                (list)Num, Name, Path
        """
        Num, Name, Path = [[] for i in range(3)]
        investment_company_res = [key for key, value in self.dict_investment_company.items() if key in subject]
        
        stock_res = [[str(key), value] for key, value in self.dict_stock_num2name.items() if str(key) in subject]
        stock_res_key = [value for key, value in self.dict_stock_num2name.items() if str(key) in subject]            
        investment_company_res = [x for x in investment_company_res if x not in stock_res_key]

        if len(investment_company_res) == 0:
            investment_company_res = ""
        else:
            investment_company_res = investment_company_res[0]
        
        # Get email attachment
        try:
            for j in range(1, len(payload['parts'])):
                if payload['parts'][j]['mimeType'] != 'text/html':
                    num, name, path = self.getAttachments(payload['parts'][j], id, stock_res)
                    
                else:
                    content = self.getMessages(payload['parts'][j]['body']['data'])
                    num, name, path = self.getAttachmentsURL(content, stock_res)

                if path != "null":
                    Num.append(num)
                    Name.append(name)
                    Path.append(path)
        except:
            content = self.getMessages(payload["body"]["data"])
            num, name, path = self.getAttachmentsURL(content, stock_res)

            if path != "null":
                Num.append(num)
                Name.append(name)
                Path.append(path)
        
        return Num, Name, investment_company_res, Path
    
    def modifyLabels(self, msgID, formats):
        """Modify mail from INBOX to label2 or label3
        
          Args:
            msgID: (String) The ID of the Message required
            formats: (String) modify from INBOX to label
        """
        
        if formats == "Label2":
            Body = { "addLabelIds": ["Label_2"], "removeLabelIds" : ["INBOX"] }
        
        elif formats == "Label3":
            Body = { "addLabelIds": ["Label_3"], "removeLabelIds" : ["INBOX"] }
            
        self.service.users().messages().modify(userId = 'me', id = msgID, body = Body).execute()

