from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import base64
from bs4 import BeautifulSoup
import pandas as pd
from apiclient import errors
import re
import requests
import urllib
import json
import urllib.parse
from urllib.parse import urlparse, parse_qs, quote

root_path = json.load(open("../../root_path.json"))

class gmailService:
    def __init__(self):
        # Define the SCOPES. If modifying it, delete the token.pickle file.
        self.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        self.creds = self.getCreds()
        # Connect to the Gmail API
        self.service = build('gmail', 'v1', credentials = self.creds)
        self.df_stock_num2name = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", sheet_name = 0)
        self.df_investment_company = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", sheet_name = 1)
        self.dict_stock_num2name = dict(zip(self.df_stock_num2name["股票代號"], self.df_stock_num2name["股票名稱"]))
        self.list_investment_company = self.df_investment_company['中文名稱'].to_list()
        self.rootPath = root_path["GMAIL_DATA_DATA_PATH"]
    
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
        
    def check_pdf_dir(self, dirName):
        """Create the file dir
        
        """
        if not os.path.isdir(self.rootPath + "/" + dirName):
            os.mkdir(self.rootPath + "/" + dirName)
    
    def getAttachments(self, encodedFile, ID, stock_num_name, investment_company_res, date, recommend):
        """Get the mail attachments already existed in mail 
        
            Args:
                encodedFile: (dictionary) dictionary contains file base64
                stock_num_name: (dictionary) key is stock numbers and value is stock name
                investment_company_res: (list) investment_company
                date: (string) mail date
            
            Return:
                If success
                    (string) Stock numbers, (string) Stock name, (string) File path
                If failed
                    (string) Null, (string) Null, (string) Null
        """
        numList, nameList, filenameList, recommendList = [[] for i in range(4)]
        i = 0

        for num, name in stock_num_name:
            try:
                att = self.service.users().messages().attachments().get(userId = 'me', messageId = ID, id = encodedFile['body']['attachmentId']).execute()
                file = att['data']
                file_data = base64.urlsafe_b64decode(file.encode('UTF-8'))
                
                if investment_company_res != "":
                    self.check_pdf_dir(num)

                    with open(f"{self.rootPath}/{num}/{num}_{name}_{date.replace('-', '')}_{investment_company_res}_{recommend[i]}.pdf", 'wb') as f:
                        f.write(file_data)
                    
                    numList.append(num)
                    nameList.append(name)
                    filenameList.append(f"{num}_{name}_{date.replace('-', '')}_{investment_company_res}_{recommend[i]}.pdf")
                    recommendList.append(recommend[i])
                    i += 1
                else:
                    self.check_pdf_dir(num)
                    
                    with open(f"{self.rootPath}/{num}/{num}_{name}_{date.replace('-', '')}_NULL_{recommend[i]}.pdf", 'wb') as f:
                        f.write(file_data)
                        
                    numList.append(num)
                    nameList.append(name)
                    filenameList.append(f"{num}_{name}_{date.replace('-', '')}_NULL_{recommend[i]}.pdf")
                    recommendList.append(recommend[i])
                    i += 1

            except errors.HttpError:
                numList.append("null")
                nameList.append("null")
                filenameList.append("null")
                recommendList.append("null")
                
        return numList, nameList, filenameList, recommendList
    
    def getAttachmentsURL(self, content, stock_num_name, date, recommend):
        """Get the attachments from url
        
            Args:
                content: (html.parser) Decoded message data
                stock_num_name: (dictionary) Key is stock numbers and value is stock name
                date: (string) mail date
            
            Return:
                If success
                    (string) Stock numbers, (string) Stock name, (string) File path
                If failed
                    (string) Null, (string) Null, (string) Null
        """
        
        a_tags = content.find_all('a')
        temp_num, temp_name, temp_filename, temp_recommend = [[] for i in range(4)]
        duplicate = []
        
        for a in range(len(a_tags)):
            if re.findall(r"https://report.yuanta-consulting.com.tw/DL.aspx\?r\=\d{6}", a_tags[a].getText()):
                try:
                    url = re.findall(r"https://report.yuanta-consulting.com.tw/DL.aspx\?r\=\d{6}", a_tags[a].getText())
                    # 取得url的response 並解析 filename
                    pdfurl = requests.get(url[0], allow_redirects = True).url

                    for num, name in stock_num_name:
                        self.check_pdf_dir(num)
                        file_rename = f"{self.rootPath}/{num}/{num}_{name}_{date.replace('-', '')}_元大_{recommend[0]}.pdf"
                        urllib.request.urlretrieve(pdfurl, file_rename)
                        return [num], [name],  [f"{num}_{name}_{date.replace('-', '')}_元大_{recommend[0]}.pdf"], [recommend]
                except:
                    return temp_num, temp_name, temp_filename, temp_recommend
            
            elif "https://www.ibfs.com.tw/CancelConsulting" in a_tags[a]["href"]:
                if a_tags[a]["href"] in duplicate:
                    continue

                duplicate.append(a_tags[a]["href"])
                
                for num, name in stock_num_name:
                    date_split = date.split("-")
                    origin_url = urlparse(a_tags[a]["href"])
                    param_name = name.replace("*", "")

                    pdfurl = "https://www.ibfs.com.tw/Support/EpaperConsulting/" + \
                    f"{parse_qs(origin_url.query)['EpaperID'][0]}/{quote(f'國票{num}{param_name}'.encode('utf-8'))}{date_split[1]}{date_split[2]}{date_split[0]}.pdf"
                    file_rename = f"{self.rootPath}/{num}/{num}_{name}_{date.replace('-', '')}_國票_{recommend[0]}.pdf"
                    urllib.request.urlretrieve(pdfurl, file_rename)
                    
                    temp_num.append(num)
                    temp_name.append(name)
                    temp_filename.append(f"{num}_{name}_{date.replace('-', '')}_國票_{recommend[0]}.pdf")
                    temp_recommend.append(recommend[0])

        return temp_num, temp_name, temp_filename, temp_recommend
    
    def verifySubject(self, subject):
        """Get the mail subject
        
            Args:
                subject: (string) Mail title
            
            Return:
                (list) re result
        """
        
        if (("統一投顧" in subject) or 
            ("國票投顧【個股報告】" in subject)):
            # 4個數字(\d{4})但後面是 .加英文 EX:5288.TT
            return re.findall(r'\d{4}(?=\.[A-Z])', subject)
        
        elif "永豐投顧" in subject:
            # 4個數字(\d{4})但後面是 空白加英文 EX:5288 TT
            return re.findall(r'\d{4}(?=\s[A-Z])', subject)
        
        elif "元富投顧" in subject:
            # 4個數字前後為() EX:(5288)
            result =  re.findall(r'\(\d{4}\)', subject)
            #拿掉()
            result = [ele[1:-1] for ele in result]

            return result
        
        elif "CTBC" in subject:
            # 4個數字前面為(後面為, (2317,OW)
            result =  re.findall(r'\(\d{4}\,', subject)
            # 拿掉( ,
            result = [ele[1:-1] for ele in result]

            return result
    
        # 4個數字(\d{4}) 後面不能接數字(\d) or/ or 年 or .
        return re.findall(r'\d{4}(?=[^\d\/\年\.])', subject)
            
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
                try:
                    date = d['value'][5:]
                    date = date.replace(" ", ",")
                    temp = date.split(",")
                    day = temp[0].zfill(2)
                    month = str(monthMap[temp[1]]).zfill(2)
                    year = temp[2]

                    date = year + "-" + month + "-" + day
                    
                    if display:
                        print("Date: ", date)
                        print("-----" * 20)
                    return date
                # 國票格式不一樣
                except:
                    date = d['value'][:11]
                    date = date.replace(" ", ",")
                    temp = date.split(",")
                    day = temp[0].zfill(2)
                    month = str(monthMap[temp[1]]).zfill(2)
                    year = temp[2]

                    date = year + "-" + month + "-" + day
                    
                    if display:
                        print("Date: ", date)
                        print("-----" * 20)
                    return date
            
    def getSubject(self, header, display = False):
        for d in header:
            if d['name'] == 'Subject':
                if display:
                    print("Subject: ", d['value'])
                    print("-----" * 20)
                subject = d['value']
                return subject
    
    def getResearch_report(self, subject, stock_num, payload, ID, date):
        """Get the research report
        
            Args:
                subject: (string) mail title
                stock_num: (list) stock number
                payload: (string) mail payload
                ID: (string) mail ID
                date: (string) mail date

            Return:
                (list)Num, Name, Path
        """     
        Num, Name, Path, mimeType, Recommend, stock_num_name, _stock_num, _stock_name = [[] for i in range(8)]
        investment_company_res = [name for name in self.list_investment_company if name in subject]
        
        for i in range(len(stock_num)):
            if stock_num[i] in self.dict_stock_num2name.keys():
                stock_num_name.append([stock_num[i], self.dict_stock_num2name[stock_num[i]]])
                _stock_num.append(stock_num[i])
                _stock_name.append(self.dict_stock_num2name[stock_num[i]])
         
        investment_company_res = [x for x in investment_company_res if x not in _stock_name]

        temp_recommendResult = self.recommend(subject, _stock_num)
        
        if len(investment_company_res) == 0:
            investment_company_res = ""
        else:
            investment_company_res = investment_company_res[0]
        
        # Get email attachment
        try:
            for j in range(1, len(payload['parts'])):
                mimeType.append(payload['parts'][j]['mimeType'])
        except:
            return Num, Name, investment_company_res, Path, Recommend

        if 'application/pdf' in mimeType:
            for i in range(len(mimeType)):
                if mimeType[i] == 'application/pdf':
                    num, name, path, recommend = self.getAttachments(payload['parts'][i + 1], ID, stock_num_name, investment_company_res, date, temp_recommendResult)
                    
                    if path != "null":
                        Num.extend(num)
                        Name.extend(name)
                        Path.extend(path)
                        Recommend.extend(recommend)
                
        else:
            for i in range(len(mimeType)):
                if mimeType[i] == 'text/html':
                    try:
                        content = self.getMessages(payload['parts'][i + 1]['body']['data'])
                    except:
                        content = self.getMessages(payload["body"]["data"])
                        
                    num, name, path, recommend = self.getAttachmentsURL(content, stock_num_name, date, temp_recommendResult)

                    if len(path) != 0:
                        Num.extend(num)
                        Name.extend(name)
                        Path.extend(path)
                        Recommend.extend(recommend)
        
        if len(investment_company_res) == 0:
            investment_company_res = "NULL"

        return Num, Name, investment_company_res, Path, Recommend
    
    def modifyLabels(self, ID, formats):
        """Modify mail from INBOX to label2 or label3
        
          Args:
            ID: (String) The ID of the Message required
            formats: (String) modify from INBOX to label
        """
        
        # 已處理
        if formats == "Label2":
            Body = { "addLabelIds": ["Label_2"], "removeLabelIds" : ["INBOX"] }
        
        # 無效郵件
        elif formats == "Label3":
            Body = { "addLabelIds": ["Label_3"], "removeLabelIds" : ["INBOX"] }
        
        # 手動處理
        elif formats == "Label_3480553467383697550":
            Body = { "addLabelIds": ["Label_3480553467383697550"], "removeLabelIds" : ["INBOX"] }

        # 無法分類
        elif formats == "Label_6440152670261486487":
            Body = { "addLabelIds": ["Label_6440152670261486487"], "removeLabelIds" : ["INBOX"] }
            
        self.service.users().messages().modify(userId = 'me', id = ID, body = Body).execute()
    
    def recommend(self, subject, stockNum):
        result = []
        
        if (("統一投顧" in subject) or 
            ("國票投顧【個股報告】" in subject)):
            end_char = ")"

            if "國票投顧【個股報告】" in subject:
                end_char = "，"

            for i in stockNum:
                offset = subject.find(i + ".TT")
                
                if offset != -1:
                    start = offset + 8
                    end = start + 2
                    
                    while ((end != len(subject)) and
                        (subject[end] != end_char)):
                        end += 1
                    
                    temp = subject[start:end].replace("/", "")
                    result.append(temp)
                else:
                    result.append("NULL")
            return result

        elif "元富投顧" in subject:
            for i in stockNum:
                idx_left_brackets = subject.find(i + ")")
                
                idx_end = idx_left_brackets + 6

                # Fwd: 元富投顧0316每日股市彙報--世芯-KY(3661)維持買進、群聯(8299)維持買進、櫻花(9911)維持買進、華夏(1305)維持買進
                # Fwd: 元富投顧個股報告--大成鋼(2027)維持買進，最壞狀況已過，客戶拉貨回穩
                # Fwd: 元富投顧訪談速報--旭富(4119)中立轉買進
                while ((idx_end != len(subject)) and 
                    (subject[idx_end] != "，") and 
                    (subject[idx_end] != "、")):
                    idx_end += 1

                temp = subject[idx_left_brackets + 5:idx_end].replace("/", "")
                result.append(temp)
            return result
        
        elif "永豐投顧" in subject:
            # Fwd: 【永豐投顧】上奇（6123 TT，B，80）/ 評價具提升空間_20230202
            idx_slash = subject.find("/")
            end = len(subject)

            for idx in range(idx_slash + 2, len(subject), 1):
                if subject[idx] == "_":
                    end = idx
                    break
            
            temp = subject[idx_slash + 2:end].replace("/", "")
            
            result.append(temp)
            return result
        
        elif (("CTBC" in subject) and ("台股晨報" not in subject)):
            # CTBC-奇鋐(3017,UG,OW)TP133-高階伺服器帶動長期營運動能-230217
            temp = subject.split("-")

            result.append(temp[2].replace("/", ""))
            return result

        return ["NULL" for i in range(len(stockNum))]