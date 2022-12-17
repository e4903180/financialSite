import sys
sys.path.append("/home/cosbi/financialSite")

import mplfinance as mpf
from gmailService.gmailService import GmailService
from pdfMaker import PdfMaker
from pythonBackend.backend.api.PythonTool.SupportResistance.SupportResistance import SupportResistance
from typing import Dict, List
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import pandas as pd
from AlertService.gmailService.constant import GMAIL_ACCOUNT
from linebot import LineBotApi
from linebot import LineBotApi
from linebot.models import ImageSendMessage, FlexSendMessage
import pyimgur
from AlertService.utils.imgur import client_id

im = pyimgur.Imgur(client_id)

class SupportResistanceHandler():
    def __init__(self) -> None:
        self._GS = GmailService()
        self._pdfMaker = PdfMaker()
        self.style = mpf.make_mpf_style(base_mpf_style = 'yahoo', rc = {'font.family': 'SimHei'})
        self.line_message = {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "",
                        "weight": "bold",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "股票代號",
                                        "color": "#aaaaaa",
                                        "flex": 2
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "起始日期",
                                        "color": "#aaaaaa",
                                        "flex": 2
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "ma",
                                        "flex": 2,
                                        "color": "#aaaaaa"
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "計算方式",
                                        "flex": 2,
                                        "color": "#aaaaaa"
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "收盤價",
                                        "flex": 2,
                                        "color": "#aaaaaa"
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "天花板",
                                        "flex": 2,
                                        "color": "#aaaaaa"
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "地板",
                                        "flex": 2,
                                        "color": "#aaaaaa"
                                    },
                                    {
                                        "type": "text",
                                        "text": "",
                                        "wrap": True,
                                        "flex": 5
                                    }
                                ]
                            },
                            {
                                "type": "text",
                                "text": "",
                                "wrap": True,
                                "align": "center"
                            }
                        ]
                    }
                ]
            }
        }
        self.image_name = ""

    def handle_support_resistance(self, line_bot_api : LineBotApi, row_data : pd.Series, email_line : Dict) -> None:
        # row_data is DB subscribe table data
        content = row_data["content"].split("_")
        SR = SupportResistance(row_data["ticker"], content[0][7:], content[1][2:], int(content[1][:2]))

        SR.get_data_yfinance()
        result = SR.run_alert(content[-1])

        if content[-1] == "method1":
            self._handle_support_resistance_method1(result, row_data, content)

        elif content[-1] == "method2":
            self._handle_support_resistance_method2(result, row_data, content)

        elif content[-1] == "method3":
            self._handle_support_resistance_method3(result, row_data, content)

        if row_data["subType"] == "Email":
            self._send_support_resistance_mail(row_data["ticker"] + "-天花板地板線-分析報告", row_data["ticker"] + "-天花板地板線-分析報告", email_line["email"])

        elif row_data["subType"] == "Line":
            self._send_support_resistance_line(line_bot_api, row_data["ticker"] + "-天花板地板線-分析報告", email_line["lineId"])

    def _handle_support_resistance_method1(self, result : Dict, row_data : Dict, content : List) -> None:
        result["table_data"] = result["table_data"].rename(columns = {"ID" : "Date"})
        result["table_data"] = result["table_data"].iloc[int(content[1][:2]):]
        result["table_data"]["Date"] = pd.to_datetime(result["table_data"]["Date"])
        result["table_data"] = result["table_data"].set_index("Date")

        apds = [
            mpf.make_addplot(result["support"]),
            mpf.make_addplot(result["resistance"]),
            mpf.make_addplot(result["ma"])
        ]
        self._create_image(apds, result["table_data"], "Method1.png", ["_not wanted", "_not wanted", "_not wanted", 'support','resistance', 'ma'])

        if (row_data["alertCondition"] == "突破天花板線") and (result["table_data"]["Close"][-1] > result["resistance"][-1]):
            alert = "警示條件觸發: 突破天花板線!!!"
        elif (row_data["alertCondition"] == "突破地板線") and (result["table_data"]["Close"][-1] < result["support"][-1]):
            alert = "警示條件觸發: 突破地板線!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        if row_data["subType"] == "Email":
            self._make_support_resistance_pdf({
                "title" : "天花板地板線",
                "tiker" : row_data["ticker"],
                "start_date" : content[0][7:],
                "ma" : content[1],
                "method" : "方法一",
                "close" : str(result["table_data"]["Close"][-1]),
                "up" : str(result["resistance"][-1]),
                "low" : str(result["support"][-1]),
                "alert" : alert,
                "filename" : row_data["ticker"] + "-天花板地板線-方法一分析報告",
                "image" : "Method1.png"
            })
        elif row_data["subType"] == "Line":
            self.image_name = "Method1.png"
            self.line_message["body"]["contents"][0]["text"] = "天花板地板線-分析報告"
            self.line_message["body"]["contents"][1]["contents"][0]["contents"][1]["text"] = row_data["ticker"]
            self.line_message["body"]["contents"][1]["contents"][1]["contents"][1]["text"] = content[0][7:]
            self.line_message["body"]["contents"][1]["contents"][2]["contents"][1]["text"] = content[1]
            self.line_message["body"]["contents"][1]["contents"][3]["contents"][1]["text"] = "方法一"
            self.line_message["body"]["contents"][1]["contents"][4]["contents"][1]["text"] = str(result["table_data"]["Close"][-1])
            self.line_message["body"]["contents"][1]["contents"][5]["contents"][1]["text"] = str(result["resistance"][-1])
            self.line_message["body"]["contents"][1]["contents"][6]["contents"][1]["text"] = str(result["support"][-1])
            self.line_message["body"]["contents"][1]["contents"][7]["text"] = alert

    def _handle_support_resistance_method2(self, result : Dict, row_data : Dict, content : List) -> None:
        result["table_data"] = result["table_data"].rename(columns = {"ID" : "Date"})
        result["table_data"] = result["table_data"].iloc[int(content[1][:2]):]
        result["table_data"]["Date"] = pd.to_datetime(result["table_data"]["Date"])
        result["table_data"] = result["table_data"].set_index("Date")

        apds = [mpf.make_addplot(result["support"]),
                mpf.make_addplot(result["ma"])]

        self._create_image(apds, result["table_data"], "Method2.png", ["_not wanted", "_not wanted", "_not wanted", 'support', 'ma'])

        if (row_data["alertCondition"] == "突破地板線") and (result["table_data"]["Close"][-1] < result["support"][-1]):
            alert = "警示條件觸發: 突破地板線!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        if row_data["subType"] == "Email":
            self._make_support_resistance_pdf({
                "title" : "天花板地板線",
                "tiker" : row_data["ticker"],
                "start_date" : content[0][7:],
                "ma" : content[1],
                "method" : "方法二",
                "close" : str(result["table_data"]["Close"][-1]),
                "up" : "無",
                "low" : str(result["support"][-1]),
                "alert" : alert,
                "filename" : row_data["ticker"] + "-天花板地板線-方法二分析報告",
                "image" : "Method2.png"
            })
        elif row_data["subType"] == "Line":
            self.image_name = "Method2.png"
            self.line_message["body"]["contents"][0]["text"] = "天花板地板線-分析報告"
            self.line_message["body"]["contents"][1]["contents"][0]["contents"][1]["text"] = row_data["ticker"]
            self.line_message["body"]["contents"][1]["contents"][1]["contents"][1]["text"] = content[0][7:]
            self.line_message["body"]["contents"][1]["contents"][2]["contents"][1]["text"] = content[1]
            self.line_message["body"]["contents"][1]["contents"][3]["contents"][1]["text"] = "方法二"
            self.line_message["body"]["contents"][1]["contents"][4]["contents"][1]["text"] = str(result["table_data"]["Close"][-1])
            self.line_message["body"]["contents"][1]["contents"][5]["contents"][1]["text"] = "無"
            self.line_message["body"]["contents"][1]["contents"][6]["contents"][1]["text"] = str(result["support"][-1])
            self.line_message["body"]["contents"][1]["contents"][7]["text"] = alert

    def _handle_support_resistance_method3(self, result : Dict, row_data : Dict, content : List) -> None:
        result["table_data"] = result["table_data"].rename(columns = {"ID" : "Date"})
        result["table_data"] = result["table_data"].iloc[int(content[1][:2]):]
        result["table_data"]["Date"] = pd.to_datetime(result["table_data"]["Date"])
        result["table_data"] = result["table_data"].set_index("Date")

        apds = [
            mpf.make_addplot(result["support"]["support1"]),
            mpf.make_addplot(result["support"]["support2"]),
            mpf.make_addplot(result["ma"])
        ]

        self._create_image(apds, result["table_data"], "Method3.png", ["_not wanted", "_not wanted", "_not wanted", 'support1%', 'support5%', 'ma'])

        if (row_data["alertCondition"] == "突破地板線1%") and (result["table_data"]["Close"][-1] < result["support"]['support1'][-1]):
            alert = "警示條件觸發: 突破地板線1%!!!"
        elif (row_data["alertCondition"] == "突破地板線5%") and (result["table_data"]["Close"][-1] < result["support"]['support2'][-1]):
            alert = "警示條件觸發: 突破地板線5%!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        if result["over"]:
            alert += " 今日交易量大於20天均量"
        else:
            alert += " 今日交易量小於20天均量"

        if row_data["subType"] == "Email":
            self._make_support_resistance_pdf({
                "title" : "天花板地板線",
                "tiker" : row_data["ticker"],
                "start_date" : content[0][7:],
                "ma" : content[1],
                "method" : "方法三",
                "close" : str(result["table_data"]["Close"][-1]),
                "up" : "無",
                "low" : f"support1: {str(result['support']['support1'][-1])}, support5%: {str(result['support']['support2'][-1])}",
                "alert" : alert,
                "filename" : row_data["ticker"] + "-天花板地板線-方法三分析報告",
                "image" : "Method3.png"
            })
        elif row_data["subType"] == "Line":
            self.image_name = "Method3.png"
            self.line_message["body"]["contents"][0]["text"] = "天花板地板線-分析報告"
            self.line_message["body"]["contents"][1]["contents"][0]["contents"][1]["text"] = row_data["ticker"]
            self.line_message["body"]["contents"][1]["contents"][1]["contents"][1]["text"] = content[0][7:]
            self.line_message["body"]["contents"][1]["contents"][2]["contents"][1]["text"] = content[1]
            self.line_message["body"]["contents"][1]["contents"][3]["contents"][1]["text"] = "方法三"
            self.line_message["body"]["contents"][1]["contents"][4]["contents"][1]["text"] = str(result["table_data"]["Close"][-1])
            self.line_message["body"]["contents"][1]["contents"][5]["contents"][1]["text"] = "無"
            self.line_message["body"]["contents"][1]["contents"][6]["contents"][1]["text"] = f"support1%: {str(result['support']['support1'][-1])}, support5%: {str(result['support']['support2'][-1])}"
            self.line_message["body"]["contents"][1]["contents"][7]["text"] = alert

    def _create_image(self, add_plots : List, table_data : pd.DataFrame, image_name : str, label : List) -> None:
        fig, axes = mpf.plot(table_data, addplot = add_plots, returnfig = True, figscale = 1.5, figratio = (16, 9), style = self.style)
        axes[0].legend(label)
        fig.savefig(f'./image/{image_name}')

    def _make_support_resistance_pdf(self, research_content : Dict):
        self._pdfMaker.make([
            {"sentence" : f"分析報告-{research_content['title']}", "align" : "C"},
            {"sentence" : f"        股票代號: {research_content['tiker']}", "align" : "L"},
            {"sentence" : f"        起始日期: {research_content['start_date']}", "align" : "L"},
            {"sentence" : f"        ma: {research_content['ma']}", "align" : "L"},
            {"sentence" : f"        計算方式: {research_content['method']}", "align" : "L"},
            {"sentence" : f"        收盤價: {research_content['close']}", "align" : "L"},
            {"sentence" : f"        天花板: {research_content['up']}", "align" : "L"},
            {"sentence" : f"        地板: {research_content['low']}", "align" : "L"},
            {"sentence" : f"{research_content['alert']}", "align" : "C"},
        ], research_content['filename'], research_content['image'])

    def _send_support_resistance_mail(self, subject : str, filename : str, email : str):
        content = MIMEMultipart()
        content["subject"] = subject
        content["from"] =  GMAIL_ACCOUNT
        content["to"] = email
        content.attach(MIMEText("附件為您在我們網站訂閱的內容"))

        with open(f"./pdf/{filename}.pdf", "rb") as f:
            pdf_attach = MIMEApplication(f.read(), _subtype = "pdf", Name = filename + '.pdf')

        content.add_header('content-disposition', 'attachment')
        content.attach(pdf_attach)

        self._GS.send_mail(content)

    def _send_support_resistance_line(self, line_bot_api : LineBotApi, alt_text : str, userId : str):
        upload_image = im.upload_image(f"/home/cosbi/financialSite/AlertService/image/{self.image_name}")
        line_bot_api.push_message(userId, ImageSendMessage(original_content_url = upload_image.link, preview_image_url = upload_image.link))
        line_bot_api.push_message(userId, FlexSendMessage(alt_text = alt_text, contents = self.line_message))