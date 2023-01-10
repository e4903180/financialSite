import sys
sys.path.append("/home/cosbi/financialSite")

from pdfMaker import PdfMaker
from pythonBackend.backend.api.PythonTool.PER_River import PerRiver
from typing import Dict, List, TextIO
import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
from plotly.subplots import make_subplots

class PerRiverHandler():
    """Handle per river method
    """

    def __init__(self, pdfMaker : PdfMaker) -> None:
        self._pdfMaker = pdfMaker
    
    def handle_per_river(self, row_data : pd.Series, fileStream : TextIO) -> None:
        """Get the user information and run per river

            Args:
                row_data : (pd.Series) User information
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        per = PerRiver()
        result = per.run(row_data["stock_num"], "MONTH")
        Kline = pd.DataFrame(result["Kline"], columns = ['Date', 'Open', 'High', 'Low', 'Close'])

        Kline["Date"] =  [datetime.fromtimestamp(date / 10**3) for date in Kline["Date"]]

        add_plots = {
            result["PER_rate"][0] : result["data1"],
            result["PER_rate"][1] : result["data2"],
            result["PER_rate"][2] : result["data3"],
            result["PER_rate"][3] : result["data4"],
            result["PER_rate"][4] : result["data5"],
            result["PER_rate"][5] : result["data6"],
        }

        filenameKline = row_data["username"] + row_data["subTime"] + "Kline.png"
        filenameBar = row_data["username"] + row_data["subTime"] + "Bar.png"

        alert = row_data["alertCondition"] + "未觸發"
        if ((row_data["alertCondition"] == "低於便宜價") and
            (result["NewPrice"] < result["cheap"])):
            alert = "警示條件觸發: 低於便宜價"

        elif ((row_data["alertCondition"] == "便宜價到合理價") and
            (result["NewPrice"] < result["reasonable"]) and
            (result["NewPrice"] > result["cheap"])):
            alert = "警示條件觸發: 便宜價到合理價"
        
        elif ((row_data["alertCondition"] == "合理價到昂貴價") and
            (result["NewPrice"] > result["reasonable"]) and
            (result["NewPrice"] < result["expensive"])):
            alert = "警示條件觸發: 合理價到昂貴價"

        elif ((row_data["alertCondition"] == "高於昂貴價") and
            (result["NewPrice"] > result["expensive"])):
            alert = "警示條件觸發: 高於昂貴價"
        result["alert"] = alert

        self._create_image_html(Kline, add_plots, row_data["stock_num"] + "-本益比河流圖", filenameKline, fileStream, row_data, result)
        self._create_image_bar_html(row_data["stock_num"] + "-定價區間", result, filenameBar, fileStream)

        self._add_page(row_data["stock_num"], result, filenameKline, filenameBar)
    
    def _create_image_html(self, Kline : pd.DataFrame, add_plots : Dict, title : str, filenameKline : str, fileStream : TextIO, table_content : Dict, result : Dict) -> None:
        """Create kline image and html

            Args:
                Kline : (pd.DataFrame) Kline data
                add_plots : (List) extra line add on kline
                title : (str) chart title
                filenameKline : (str) image name
                fileStream : (TextIO) html file stream
                table_content : (Dict) table content
                result : (Dict) calculate result
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

        container = f'<div class="row mx-auto py-3" style="width:70vw"><div class="card p-0 mt-3"><div class="card-header text-center">{title}</div><div class="card-body">'

        container += f'<p class="card-text">股票代號: {table_content["stock_num"]}</p>'
        container += f'<p class="card-text">最新價格: {result["NewPrice"]}</p>'
        container += f'<p class="card-text">最新EPS: {result["EPS"]}</p>'
        container += f'<p class="card-text">本益比換算倍率: {result["PER_rate"]}</p>'
        container += f'<p class="card-text">評價: {result["evaluate"]}</p>'
        container += f'<p class="card-text text-center" style="color:red">{result["alert"]}</p>'
        
        container += '</div>' + fig.to_html(full_html = False, include_plotlyjs = 'cdn')

        fileStream.write(container)

        fig.update_layout(xaxis_rangeslider_visible = False)
        fig.write_image("./image/" + filenameKline)

    def _create_image_bar_html(self, title : str, result : Dict, filenameBar : str, fileStream : TextIO):
        """Create bar image

            Args:

                filenameBar : (str) image name
            Return:
                None
        """
        y_label = ["本益比河流圖"]
        fig = make_subplots(subplot_titles = [title])
        fig.add_trace(go.Bar(y = y_label, x = result["down_cheap"], name = "便宜價", orientation = "h", marker = {"color":"#FFFF4F"}))
        fig.add_trace(go.Bar(y = y_label, x = result["cheap_reasonable"], name = "便宜價到合理價區間", orientation = "h", marker = {"color":"#59FF59"}))
        fig.add_trace(go.Bar(y = y_label, x = result["reasonable_expensive"], name = "合理價到昂貴價區間", orientation = "h", marker = {"color":"#FF5353"}))
        fig.add_trace(go.Bar(y = y_label, x = result["up_expensive"], name = "昂貴價", orientation = "h", marker = {"color":"red"}))
        fig.update_layout(barmode = 'stack')
        fig.add_vline(x = result["NewPrice"], line_width = 3, line_color = "black", annotation_text = "現在價格")

        container = fig.to_html(full_html = False, include_plotlyjs = 'cdn') + "</div></div>"
        fileStream.write(container)
        
        fig.write_image("./image/" + filenameBar)

    def _add_page(self, ticker : str, result_content : Dict, filenameKline : str, filenameBar : str):
        """Add new page to pdf

            Args:
                research_content : (Dict) content
                filenameKline : (str) kline image name
                filenameBar : (str) bar image name
            Return:
                None
        """
        self._pdfMaker.make_per_river([
            {"sentence" : f"分析報告-本益比河流圖", "align" : "C"},
            {"sentence" : f"        股票代號: {ticker}", "align" : "L"},
            {"sentence" : f"        最新價格: {result_content['NewPrice']}", "align" : "L"},
            {"sentence" : f"        最新EPS: {result_content['EPS']}", "align" : "L"},
            {"sentence" : f"        本益比換算倍率: {result_content['PER_rate']}", "align" : "L"},
            {"sentence" : f"        {result_content['evaluate']}", "align" : "L"},
            {"sentence" : f"        {result_content['alert']}", "align" : "C"},
        ], filenameKline, filenameBar)
