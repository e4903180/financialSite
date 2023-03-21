from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from typing import List, Dict
from tqdm import tqdm
from bs4 import BeautifulSoup
import pickle
import json
import os
import sys
import datetime
import base64
import re
import pandas as pd
import urllib
from urllib.parse import urlparse, parse_qs, quote

root_path = json.load(open("../../root_path.json"))

class Pattern():
    def __init__(self) -> None:
        self.investment_companys = pd.read_excel("./src/24932_個股代號及券商名稱.xlsx", sheet_name = 1)
        self.investment_companys = self.investment_companys['中文名稱'].to_list()

    def find_stock_nums(self, info : Dict) -> List:
        """Find stock nums in subject
        
            Args:
                info: (Dict) sender, subject, date
            
            Return:
                (list) re result
        """
        
        if (("統一投顧" in info["subject"]) or 
            ("國票投顧【個股報告】" in info["subject"])):
            # 4個數字(\d{4})但後面是 .加英文 EX:5288.TT
            return re.findall(r'\d{4}(?=\.[A-Z])', info["subject"])
        
        elif "永豐投顧" in info["subject"]:
            # 4個數字(\d{4})但後面是 空白加英文 EX:5288 TT
            return re.findall(r'\d{4}(?=\s[A-Z])', info["subject"])
        
        elif "元富投顧" in info["subject"]:
            # 4個數字前後為() EX:(5288)
            result =  re.findall(r'\(\d{4}\)', info["subject"])
            # 拿掉()
            result = [ele[1:-1] for ele in result]

            return result
        
        elif "CTBC" in info["subject"]:
            # 4個數字前面為(後面為, (2317,OW)
            result =  re.findall(r'\(\d{4}\,', info["subject"])
            # 拿掉( ,
            result = [ele[1:-1] for ele in result]

            return result
        
        # 4個數字(\d{4}) 後面不能接數字(\d) or/ or 年 or .
        return re.findall(r'\d{4}(?=[^\d\/\年\.])', info["subject"])

    def find_investment_company(self, info : Dict) -> str:
        """Find investment company in subject

            Args :
                info : (Dict) sender, subject, date
            
            Return :
                investment_company : (str) investment company
        """
        for investment_company in self.investment_companys:
            if investment_company in info["subject"]:
                return investment_company
        return "NULL"

    def find_recommend(self, info : Dict, stock_nums : List) -> List:
        """Find recommend in subject

            Args :
                info : (Dict) sender, subject, date
                stock_nums : (List) stock nums
            
            Return :
                result : (List) recommend
        """
        result = []

        if (("統一投顧" in info["subject"]) or 
            ("國票投顧【個股報告】" in info["subject"])):
            end_char = ")"

            if "國票投顧【個股報告】" in info["subject"]:
                end_char = "，"
            
            for stock_num in stock_nums:
                offset = info["subject"].find(stock_num + ".TT")
                
                if offset != -1:
                    start = offset + 8
                    end = start + 2
                    
                    while ((end != len(info["subject"]) and
                        (info["subject"][end] != end_char))):
                        end += 1
                    
                    temp = info["subject"][start:end].replace("/", "")
                    result.append(temp)
                else:
                    result.append("NULL")
            return result

        elif "元富投顧" in info["subject"]:
            for stock_num in stock_nums:
                idx_left_brackets = info["subject"].find(stock_num + ")")
                
                idx_end = idx_left_brackets + 6

                # Fwd: 元富投顧0316每日股市彙報--世芯-KY(3661)維持買進、群聯(8299)維持買進、櫻花(9911)維持買進、華夏(1305)維持買進
                # Fwd: 元富投顧個股報告--大成鋼(2027)維持買進，最壞狀況已過，客戶拉貨回穩
                # Fwd: 元富投顧訪談速報--旭富(4119)中立轉買進
                while ((idx_end != len(info["subject"])) and 
                    (info["subject"][idx_end] != "，") and 
                    (info["subject"][idx_end] != "、")):
                    idx_end += 1

                temp = info["subject"][idx_left_brackets + 5:idx_end].replace("/", "")
                result.append(temp)

            return result

        return ["NULL" for i in range(len(stock_nums))]

    def find_remark(self, info : Dict, stock_nums : List) -> List:
        """Find remark in subject

            Args :
                info : (Dict) sender, subject, date
                stock_nums : (List) stock nums
            
            Return :
                result : (List) remark
        """
        result = []

        if "永豐投顧" in info["subject"]:
            # Fwd: 【永豐投顧】上奇（6123 TT，B，80）/ 評價具提升空間_20230202
            idx_slash = info["subject"].find("/")
            end = len(info["subject"])

            for idx in range(idx_slash + 2, len(info["subject"]), 1):
                if info["subject"][idx] == "_":
                    end = idx
                    break
            
            temp = info["subject"][idx_slash + 2:end].replace("/", "")
            
            result.append(temp)
            
            return result
        
        elif "CTBC" in info["subject"]:
            # CTBC-奇鋐(3017,UG,OW)TP133-高階伺服器帶動長期營運動能-230217
            temp = info["subject"].split("-")

            result.append(temp[2].replace("/", ""))

            return result
        
        elif "國票投顧【個股報告】" in info["subject"]:
            # Fwd: 國票投顧【個股報告】漢翔(2634.TT)買進，目標價NT$45
            comma_idx = info["subject"].find("，")
            result.append(info["subject"][comma_idx + 1:])

            return result
        
        return ["NULL" for i in range(len(stock_nums))]


class GmailResearchHandle():
    """Handle research in gmail
    """
    def __init__(self) -> None:
        # Define the SCOPES. If modifying it, delete the token.pickle file.
        self._scopes = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
        self._service = build('gmail', 'v1', credentials = self._verify_gmail_api())
        self.monthMap = { "Jan" : 1, "Feb" : 2, "Mar" : 3, "Apr" : 4, "May" : 5, "Jun" : 6,
           "Jul" : 7, "Aug" : 8, "Sep" : 9, "Oct" : 10, "Nov" : 11, "Dec" : 12 }
        self.skip_subjects = ["CTBC-台股晨報", "CTBC-前日"]
        self.unhandle_dir = [f"/home/uikai/financialData/test/1", "/home/uikai/financialData/test/2"]
        # self.unhandle_dir = [f"{root_path['UNZIP_PATH']}/{datetime.now().strftime('%Y%m%d')/1}",
        #                       f"{root_path['UNZIP_PATH']}/{datetime.now().strftime('%Y%m%d')/2}"]
        self._check_unhandle_dir()

        self.stock_num2name = pd.read_excel(root_path["TICKER_LIST_DIR_PATH"] + "24932_個股代號及券商名稱.xlsx", sheet_name = 0)
        self.stock_num2name = dict(zip(self.stock_num2name["股票代號"], self.stock_num2name["股票名稱"]))
        self.pattern = Pattern()

    def _check_unhandle_dir(self) -> None:
        """Check if unhandle dir exist

            Args :
                None
            Return :
                None
        """
        for path in self.unhandle_dir:
            if not os.path.isdir(path):
                os.makedirs(path)

    def _verify_gmail_api(self) -> str:
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
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', self._scopes)
                creds = flow.run_local_server(port=0)

            # Save the access token in token.pickle file for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
        return creds

    def _get_mail_ids(self) -> List:
        """Get the mail's id in inbox through gmail api

            Args :
                None
            
            Return :
                (List) mail's id
        """
        result = self._service.users().messages().list(userId = 'me', maxResults = 500, labelIds = ["INBOX"]).execute()
        mails = result.get('messages')

        return [] if mails == None else [mail["id"] for mail in mails]

    def _get_mail_content(self, mail_id : str) -> Dict:
        """Use mail's id to get mail's content through gmail api

            Args :
                mail_id : (str) mail's id
            Return :
                (Dict) mail's content
        """
        return self._service.users().messages().get(userId = 'me', id = mail_id).execute()

    def _handle_date_format(self, origin_date : str) -> str:
        """Transform origin date to specific date format

            ex:
                origin date : Wed, 15 Mar 2023 08:26:50 +0000
                transformed date : 2023-03-15
            
            Args :
                origin_date : (str) origin date format
            Return :
                transformed_date : (str) transformed date format
        """
        date = origin_date[5:]
        temp = date.split(" ")

        day = temp[0].zfill(2)
        month = str(self.monthMap[temp[1]]).zfill(2)
        year = temp[2]

        transformed_date = year + month + day

        return transformed_date

    def _get_sender_subject_date(self, headers : Dict) -> Dict:
        """Get sender, subject, date through hraders

            Args :
                headers : (Dict) headers of mail
            Return :
                result : (Dict)  sender, subject, date
        """
        result = {}

        for header in headers:
            if header["name"] == "From":
                result["sender"] = header["value"]

            elif header["name"] == "Subject":
                result["subject"] = header["value"]
            
            elif header["name"] == "Date":
                result["date"] = self._handle_date_format(header["value"])
        
        return result

    def _modifyLabel(self, mail_id : str, label : str) -> None:
        """Modify mail from INBOX to another
        
            Args:
                mail_id: (str) mail's id
                label: (str) label

            Return :
                None
        """
        # 已處理
        if label == "handled":
            Body = { "addLabelIds": ["Label_2"], "removeLabelIds" : ["INBOX"] }
        
        # 無效郵件
        elif label == "invalid":
            Body = { "addLabelIds": ["Label_3"], "removeLabelIds" : ["INBOX"] }
        
        # 手動處理
        elif label == "manual":
            Body = { "addLabelIds": ["Label_3480553467383697550"], "removeLabelIds" : ["INBOX"] }

        # 無法分類
        elif label == "Label_6440152670261486487":
            Body = { "addLabelIds": ["Label_6440152670261486487"], "removeLabelIds" : ["INBOX"] }
            
        self._service.users().messages().modify(userId = 'me', id = mail_id, body = Body).execute()
    
    def _if_specific_subject(self, subject : str) -> bool:
        """Check if subject need to skip

            Args :
                subject : (str) mail's subject

            Return :
                bool
        """
        skip = False

        for skip_subject in self.skip_subjects:
            if skip_subject in subject:
                skip = True
                break
        
        return skip

    def _if_specific_sender(self, info : Dict) -> bool:
        """Check if sender is "辜睿齊"

            Args :
                info : (Dict) sender, subject, date

            Return :
                bool
        """
        return True if "辜睿齊" in info["sender"] else False

    def _handle_specific_sender(self, info : Dict, mail_id : str, payload : Dict) -> None:
        """Hadle mail which sender is 辜睿齊

            Args :
                info : (Dict) sender, subject, date
                mail_id : (str) mail's id
                payload : (Dict) mail's payload

            Return :
                None
        """
        for file_ptr in range(1, len(payload['parts']), 1):
            if ((payload['parts'][file_ptr]['filename'] not in os.listdir(self.unhandle_dir[0])) and 
                    ('attachmentId' in payload['parts'][file_ptr]['body'])):

                att = self._service.users().messages().attachments().get(userId = 'me', messageId = mail_id, 
                    id = payload['parts'][file_ptr]['body']['attachmentId']).execute()

                file = att['data']
                file_data = base64.urlsafe_b64decode(file.encode('UTF-8'))

                field = payload['parts'][file_ptr]['filename'].split(" ")

                with open(f"{self.unhandle_dir[0]}/{field[0][:4]}_{self.stock_num2name[field[0][:4]]}_{info['date']}_{field[1].replace('.pdf', '')}_NULL_NULL.pdf",
                        'wb') as f:
                    f.write(file_data)

    def _download_pdf(self, mail_id : str, attachment_id : str, mail_pattern : Dict) -> None:
        """Download pdf through gmail api

            Args :
                mail_id : (str) mail's id
                attachment_id : (str) pdf id
                mail_pattern : (Dict) pattern of mail like stock_num, investment_company, recommend, remark, date
            
            Return :
                None
        """

        for stock_num, recommend, remark in zip(mail_pattern["stock_nums"], mail_pattern["recommend"], mail_pattern["remark"]):
            stock_name = self.stock_num2name[stock_num]
            
            if f"{stock_num}_{stock_name}_{mail_pattern['date']}_{mail_pattern['investment_company']}_{recommend}_{remark}.pdf" in os.listdir(self.unhandle_dir[0]):
                continue

            try:
                att = self._service.users().messages().attachments().get(userId = 'me', messageId = mail_id, id = attachment_id).execute()
                file = att['data']
                file_data = base64.urlsafe_b64decode(file.encode('UTF-8'))

                filename = f"{self.unhandle_dir[0]}/" + \
                    f"{stock_num}_{stock_name}_{mail_pattern['date']}_{mail_pattern['investment_company']}_{recommend}_{remark}.pdf"
                
                with open(filename, 'wb') as f:
                    f.write(file_data)

            except Exception as e:
                print(e, file = sys.stderr)

    def _get_html(self, html_encoded : str) -> BeautifulSoup:
        """Get html content

            Args :
                html_encoded : (str) html encoded
            
            Return :
                html with beautifulsoup
        """
        data = html_encoded.replace("-","+").replace("_","/")
        decoded_data = base64.b64decode(data)
        decoded_data = decoded_data.decode("utf-8")
        decoded_data = BeautifulSoup(decoded_data, 'html.parser')

        return decoded_data

    def _download_from_href(self, html_encoded : str, mail_pattern : Dict) -> None:
        """Download pdf from href in mail's html

            Args :
                payload : (Dict) payload

            Return :
                None
        """

        soup = self._get_html(html_encoded)

        downloaded_href = []
        a_tags = soup.find_all('a')

        for a_tag in a_tags:                    
            if "https://www.ibfs.com.tw/CancelConsulting" in a_tag["href"]:
                if a_tag["href"] in downloaded_href:
                    continue

                downloaded_href.append(a_tag["href"])
                
                for stock_num, recommend, remark in zip(mail_pattern["stock_nums"], mail_pattern["recommend"], mail_pattern["remark"]):
                    date_mail = soup.find_all('td')[1].getText()[:10].replace(".", "")
                    origin_url = urlparse(a_tag["href"])
                    stock_name = self.stock_num2name[stock_num]
                    param_name = stock_name.replace("*", "")

                    pdfurl = "https://www.ibfs.com.tw/Support/EpaperConsulting/" + \
                        f"{parse_qs(origin_url.query)['EpaperID'][0]}/{quote(f'國票{stock_num}{param_name}'.encode('utf-8'))}{date_mail[4:]}{date_mail[0:4]}.pdf"
                    
                    filename = f"{self.unhandle_dir[0]}/" + \
                        f"{stock_num}_{stock_name}_{mail_pattern['date']}_國票_{recommend}_{remark}.pdf"

                    urllib.request.urlretrieve(pdfurl, filename)

    def _handle_normal(self, mail_id : str, stock_nums : List, info : Dict, payload : Dict) -> None:
        """Handle mail under rule

            Args :
                mail_id : (str) mail's id
                stock_nums : (List) stock_num in subject
                info : (Dict) sender, subject, date
                payload : (Dict) mail'a payload
            
            Return:
                None
        """
        mimeType = {"pdf" : [], "html" : ""}

        investment_company = self.pattern.find_investment_company(info)
        recommend = self.pattern.find_recommend(info, stock_nums)
        remark = self.pattern.find_remark(info, stock_nums)

        if "parts" not in payload:
            return

        for i in range(1, len(payload['parts']), 1):
            if payload['parts'][i]['mimeType'] == "application/pdf":
                mimeType["pdf"].append(payload['parts'][i]['body']['attachmentId'])

            elif payload['parts'][i]['mimeType'] == "text/html":
                if (("國票投顧" in info["subject"]) and
                    ("body" in payload['parts'][i])):
                    mimeType["html"] = payload['parts'][i]['body']['data']

        mail_pattern = {
            "stock_nums" : stock_nums,
            "investment_company" : investment_company,
            "recommend" : recommend,
            "remark" : remark,
            "date" : info["date"]
        }

        if len(mimeType["pdf"]) != 0:
            for attachmentId in mimeType["pdf"]:
                self._download_pdf(mail_id, attachmentId, mail_pattern)
        else:
            if mimeType["html"] != "":
                self._download_from_href(mimeType["html"], mail_pattern)
            else:
                print(f"subject: {info['subject']} failed download", file = sys.stderr)

    def run(self) -> None:
        """Run

            Args :
                None

            Return :
                None
        """
        # Get all mail's id in INBOX
        mail_ids = self._get_mail_ids()

        # If nothing in inbox, terminate
        if len(mail_ids) == 0:
            print("Nothing in INBOX update end", file = sys.stderr)
            return

        # Traverse all mails
        for mail_id in tqdm(mail_ids):
            # Get mail's content
            content = self._get_mail_content(mail_id)

            # Get sender, subject and date through headers
            info = self._get_sender_subject_date(content["payload"]["headers"])

            # Check if this mail's subject has to skip 
            if self._if_specific_subject(info["subject"]):
                # Modify mail to invalid label
                self._modifyLabel(mail_id, "invalid")
                continue
            
            # Check if sender is 辜睿齊
            if self._if_specific_sender(info):
                # handle specific sender
                self._handle_specific_sender(info, mail_id, content["payload"])

                # Modify mail to manual label
                self._modifyLabel(mail_id, "manual")
                continue
            
            # Find stock_nums in subject
            stock_nums = self.pattern.find_stock_nums(info)

            # Check if stock_nums is empty
            if len(stock_nums) == 0:
                # Modify mail to manual invalid
                self._modifyLabel(mail_id, "invalid")
                continue
            
            # Handle mail which exists stock number
            self._handle_normal(mail_id, stock_nums, info, content["payload"])

            # Modify mail to handled
            self._modifyLabel(mail_id, "handled")

if __name__ == "__main__":
    sys.stderr = open(root_path["GMAIL_DATA_LOG_PATH"] + "/" + str(datetime.datetime.now()) + '.log', 'w')
    GRH = GmailResearchHandle()

    GRH.run()