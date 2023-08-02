import json
import sys
sys.path.append(json.load(open("../root_path.json"))["PROJECT_ROOT_PATH"])

from pdfMaker import PdfMaker
from pythonBackend.backend.api.PythonTool.SupportResistance.SupportResistance import SupportResistance
from typing import Dict, List, TextIO
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

root_path = json.load(open("../root_path.json"))

class SupportResistanceHandler():
    """Handle support resistance method
    """

    def __init__(self, pdfMaker : PdfMaker) -> None:
        self._pdfMaker = pdfMaker

    def handle_support_resistance(self, row_data : pd.Series, fileStream : TextIO) -> None:
        """Get the user information and run support resistance

            Args:
                row_data : (pd.Series) User information
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        # row_data is DB subscribe table data
        content = row_data["content"].split("_")
        SR = SupportResistance(row_data["stock_num"], content[0][7:], content[1][2:], int(content[1][:2]))

        SR.get_data_yfinance()
        result = SR.run(content[-1])

        if content[-1] == "method1":
            self._handle_support_resistance_method1(result, row_data, content, fileStream)

        elif content[-1] == "method2":
            self._handle_support_resistance_method2(result, row_data, content, fileStream)

        elif content[-1] == "method3":
            self._handle_support_resistance_method3(result, row_data, content, fileStream)

    def _handle_support_resistance_method1(self, result : Dict, row_data : pd.Series, content : List, fileStream : TextIO) -> None:
        """Make the kline research image and add pdf page with format method1

            Args:
                result : (Dict) result of the support resistance
                row_data : (pd.Series) user information
                content : (List) user settings
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        result["table_data"]["data"] = pd.DataFrame.from_dict(result["table_data"]["data"])
        result["table_data"]["data"] = result["table_data"]["data"].rename(columns = {"ID" : "Date"})
        result["table_data"]["data"]["Date"] = pd.to_datetime(result["table_data"]["data"]["Date"])
        image_filename = row_data["username"] + row_data["subTime"] + ".png"

        add_plots = {
            "support" : result["support"],
            "resistance" : result["resistance"],
            "ma" : result["ma"]
        }

        if ((row_data["alertCondition"] == "突破天花板線") and
            (result["table_data"]["data"].iloc[-1]["Close"] > result["resistance"][-1][1])):
            alert = "警示條件觸發: 突破天花板線!!!"
        elif ((row_data["alertCondition"] == "突破地板線") and
            (result["table_data"]["data"].iloc[-1]["Close"] < result["support"][-1][1])):
            alert = "警示條件觸發: 突破地板線!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        table_content = {
            "title" : "天花板地板線",
            "ticker" : row_data["stock_num"],
            "start_date" : content[0][7:],
            "ma" : content[1],
            "method" : "方法一",
            "close" : str(result["table_data"]["data"].iloc[-1]["Close"]),
            "up" : str(result["resistance"][-1][1]),
            "low" : str(result["support"][-1][1]),
            "alert" : alert,
        }

        self._create_image_html(result["table_data"]["data"], add_plots, image_filename, row_data["stock_num"] + "-天花板地板線", fileStream, table_content)
        table_content["image"] = image_filename
        
        self._add_page(table_content)

    def _handle_support_resistance_method2(self, result : Dict, row_data : Dict, content : List, fileStream : TextIO) -> None:
        """Make the kline research image and add pdf page with format method2

            Args:
                result : (Dict) result of the support resistance
                row_data : (pd.Series) user information
                content : (List) user settings
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        result["table_data"]["data"] = pd.DataFrame.from_dict(result["table_data"]["data"])
        result["table_data"]["data"] = result["table_data"]["data"].rename(columns = {"ID" : "Date"})
        result["table_data"]["data"]["Date"] = pd.to_datetime(result["table_data"]["data"]["Date"])
        image_filename = row_data["username"] + row_data["subTime"] + ".png"

        add_plots = {
            "support" : result["support"],
            "ma" : result["ma"]
        }

        if ((row_data["alertCondition"] == "突破地板線") and
            (result["table_data"]["data"].iloc[-1]["Close"] < result["support"][-1][-1])):
            alert = "警示條件觸發: 突破地板線!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        table_content = {
            "title" : "天花板地板線",
            "ticker" : row_data["stock_num"],
            "start_date" : content[0][7:],
            "ma" : content[1],
            "method" : "方法二",
            "close" : str(result["table_data"]["data"].iloc[-1]["Close"]),
            "up" : "無",
            "low" : str(result["support"][-1][1]),
            "alert" : alert,
        }

        self._create_image_html(result["table_data"]["data"], add_plots, image_filename, row_data["stock_num"] + "-天花板地板線", fileStream, table_content)

        table_content["image"] = image_filename

        self._add_page(table_content)

    def _handle_support_resistance_method3(self, result : Dict, row_data : Dict, content : List, fileStream : TextIO) -> None:
        """Make the kline research image and add pdf page with format method3

            Args:
                result : (Dict) result of the support resistance
                row_data : (pd.Series) user information
                content : (List) user settings
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        result["table_data"]["data"] = pd.DataFrame.from_dict(result["table_data"]["data"])
        result["table_data"]["data"] = result["table_data"]["data"].rename(columns = {"ID" : "Date"})
        result["table_data"]["data"]["Date"] = pd.to_datetime(result["table_data"]["data"]["Date"])
        image_filename = row_data["username"] + row_data["subTime"] + ".png"

        add_plots = {
            "support1" : result['support']['support1'],
            "support5" : result['support']['support2'],
            "ma" : result["ma"]
        }

        if ((row_data["alertCondition"] == "突破地板線1%") and
            (result["table_data"]["data"].iloc[-1]["Close"] < result["support"]['support1'][-1][1])):
            alert = "警示條件觸發: 突破地板線1%!!!"
        elif ((row_data["alertCondition"] == "突破地板線5%") and
            (result["table_data"]["data"].iloc[-1]["Close"] < result["support"]['support2'][-1][1])):
            alert = "警示條件觸發: 突破地板線5%!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        if result["over"]:
            alert += " 今日交易量大於20天均量"
        else:
            alert += " 今日交易量小於20天均量"

        table_content = {
            "title" : "天花板地板線",
            "ticker" : row_data["stock_num"],
            "start_date" : content[0][7:],
            "ma" : content[1],
            "method" : "方法三",
            "close" : str(result["table_data"]["data"].iloc[-1]["Close"]),
            "up" : "無",
            "low" : f"support1%: {str(result['support']['support1'][-1][1])}, support5%: {str(result['support']['support2'][-1][1])}",
            "alert" : alert,
        }

        self._create_image_html(result["table_data"]["data"], add_plots, image_filename, row_data["stock_num"] + "-天花板地板線", fileStream, table_content)

        table_content["image"] = image_filename

        self._add_page(table_content)

    def _create_image_html(self, Kline : pd.DataFrame, add_plots : Dict, image_filename : str, title : str, fileStream : TextIO, table_content : Dict) -> None:
        """Create image and html

            Args:
                Kline : (pd.DataFrame) ohlc data
                add_plots : (List) extra line add on kline
                image_name : (str) image name
                title : (str) image title
                fileStream : (TextIO) html file stream
                table_content : (Dict) result of the table content
            Return:
                None
        """
        fig = make_subplots(subplot_titles = [title], specs = [[{"secondary_y": True}]])

        fig.add_trace(go.Candlestick(name = "OHLC",
                                x = Kline["Date"],
                                open = Kline['Open'],
                                high = Kline['High'],
                                low = Kline['Low'],
                                close = Kline['Close']))
        
        for key in add_plots.keys():
            temp_x = []
            temp_y = []

            for ele in add_plots[key]:
                temp_x.append(ele[0])
                temp_y.append(ele[1])

            fig.add_trace(go.Scatter(x = temp_x, y = temp_y, mode = "lines", name = key))
        
        fig.add_trace(go.Bar(name = "Volume", x = Kline["Date"], y = Kline["Volume"]), secondary_y = True)

        fig.layout.yaxis2.showgrid = False

        container = f'<div class="row mx-auto py-3" style="width:70vw"><div class="card p-0 mt-3"><div class="card-header text-center">{title}</div><div class="card-body">'

        container += f'<p class="card-text">股票代號: {table_content["ticker"]}</p>'
        container += f'<p class="card-text">資料起始日: {table_content["start_date"]}</p>'
        container += f'<p class="card-text">ma類型: {table_content["ma"]}</p>'
        container += f'<p class="card-text">計算方式: {table_content["method"]}</p>'
        container += f'<p class="card-text">收盤價: {table_content["close"]}</p>'
        container += f'<p class="card-text">天花板: {table_content["up"]}</p>'
        container += f'<p class="card-text">地板: {table_content["low"]}</p>'
        container += f'<p class="card-text text-center" style="color:red">{table_content["alert"]}</p>'
        
        container += '</div>' + fig.to_html(full_html = False, include_plotlyjs = 'cdn') + '</div></div>'
        fileStream.write(container)

        fig.update_layout(xaxis_rangeslider_visible = False)
        fig.write_image(f"{root_path['ALTERSERVICE_IMAGE_PATH']}/{image_filename}")

    def _add_page(self, table_content : Dict) -> None:
        """Add new page to pdf

            Args:
                table_content : (Dict) result of the table content
            Return:
                None
        """
        self._pdfMaker.make_support_resistance([
            {"sentence" : f"分析報告-{table_content['title']}", "align" : "C"},
            {"sentence" : f"        股票代號: {table_content['ticker']}", "align" : "L"},
            {"sentence" : f"        起始日期: {table_content['start_date']}", "align" : "L"},
            {"sentence" : f"        ma: {table_content['ma']}", "align" : "L"},
            {"sentence" : f"        計算方式: {table_content['method']}", "align" : "L"},
            {"sentence" : f"        收盤價: {table_content['close']}", "align" : "L"},
            {"sentence" : f"        天花板: {table_content['up']}", "align" : "L"},
            {"sentence" : f"        地板: {table_content['low']}", "align" : "L"},
            {"sentence" : f"{table_content['alert']}", "align" : "C"},
        ], table_content['image'])