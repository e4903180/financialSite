import sys
sys.path.append("/home/cosbi/financialSite")

from pdfMaker import PdfMaker
from pythonBackend.backend.api.PythonTool.SupportResistance.SupportResistance import SupportResistance
from typing import Dict, List, TextIO
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

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
        SR = SupportResistance(row_data["ticker"], content[0][7:], content[1][2:], int(content[1][:2]))

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
        self._create_image_html(result["table_data"]["data"], add_plots, image_filename, row_data["ticker"] + "-天花板地板線", fileStream)

        if ((row_data["alertCondition"] == "突破天花板線") and
            (result["table_data"]["data"].iloc[-1]["Close"] > result["resistance"][-1][1])):
            alert = "警示條件觸發: 突破天花板線!!!"
        elif ((row_data["alertCondition"] == "突破地板線") and
            (result["table_data"]["data"].iloc[-1]["Close"] < result["support"][-1][1])):
            alert = "警示條件觸發: 突破地板線!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        self._add_page({
            "title" : "天花板地板線",
            "tiker" : row_data["ticker"],
            "start_date" : content[0][7:],
            "ma" : content[1],
            "method" : "方法一",
            "close" : str(result["table_data"]["data"].iloc[-1]["Close"]),
            "up" : str(result["resistance"][-1][1]),
            "low" : str(result["support"][-1][1]),
            "alert" : alert,
            "image" : image_filename
        })

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
        self._create_image_html(result["table_data"]["data"], add_plots, image_filename, row_data["ticker"] + "-天花板地板線", fileStream)

        if ((row_data["alertCondition"] == "突破地板線") and
            (result["table_data"]["data"].iloc[-1]["Close"] < result["support"][-1][-1])):
            alert = "警示條件觸發: 突破地板線!!!"
        else:
            alert = row_data["alertCondition"] + "未觸發"

        self._add_page({
            "title" : "天花板地板線",
            "tiker" : row_data["ticker"],
            "start_date" : content[0][7:],
            "ma" : content[1],
            "method" : "方法二",
            "close" : str(result["table_data"]["data"].iloc[-1]["Close"]),
            "up" : "無",
            "low" : str(result["support"][-1][1]),
            "alert" : alert,
            "image" : image_filename
        })

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
        self._create_image_html(result["table_data"]["data"], add_plots, image_filename, row_data["ticker"] + "-天花板地板線", fileStream)

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

        self._add_page({
            "title" : "天花板地板線",
            "tiker" : row_data["ticker"],
            "start_date" : content[0][7:],
            "ma" : content[1],
            "method" : "方法三",
            "close" : str(result["table_data"]["data"].iloc[-1]["Close"]),
            "up" : "無",
            "low" : f"support1: {str(result['support']['support1'][-1][1])}, support5%: {str(result['support']['support2'][-1][1])}",
            "alert" : alert,
            "image" : image_filename
        })

    def _create_image_html(self, Kline : pd.DataFrame, add_plots : Dict, image_filename : str, title : str, fileStream : TextIO) -> None:
        """Create image and html

            Args:
                Kline : (pd.DataFrame) ohlc data
                add_plots : (List) extra line add on kline
                image_name : (str) image name
                title : (str) image title
                fileStream : (TextIO) html file stream
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
        fileStream.write(fig.to_html(full_html = False, include_plotlyjs = 'cdn'))

        fig.update_layout(xaxis_rangeslider_visible = False)
        fig.write_image("./image/" + image_filename)

    def _add_page(self, research_content : Dict) -> None:
        """Add new page to pdf

            Args:
                research_content : (Dict) content
            Return:
                None
        """
        self._pdfMaker.make_support_resistance([
            {"sentence" : f"分析報告-{research_content['title']}", "align" : "C"},
            {"sentence" : f"        股票代號: {research_content['tiker']}", "align" : "L"},
            {"sentence" : f"        起始日期: {research_content['start_date']}", "align" : "L"},
            {"sentence" : f"        ma: {research_content['ma']}", "align" : "L"},
            {"sentence" : f"        計算方式: {research_content['method']}", "align" : "L"},
            {"sentence" : f"        收盤價: {research_content['close']}", "align" : "L"},
            {"sentence" : f"        天花板: {research_content['up']}", "align" : "L"},
            {"sentence" : f"        地板: {research_content['low']}", "align" : "L"},
            {"sentence" : f"{research_content['alert']}", "align" : "C"},
        ], research_content['image'])