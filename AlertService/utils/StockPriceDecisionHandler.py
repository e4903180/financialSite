import sys
sys.path.append("/home/cosbi/financialSite")

from pdfMaker import PdfMaker
from pythonBackend.backend.api.PythonTool.StockPriceDecision import PricingStrategy
from typing import Dict, List, TextIO
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

class StockPriceDecisionHandler():
    """Handle stock price decision method
    """

    def __init__(self, pdfMaker : PdfMaker) -> None:
        self._pdfMaker = pdfMaker

    def handle_stock_pricing_decision(self, row_data : pd.Series, fileStream : TextIO) -> None:
        """Get the user information and run stock pricing decision

            Args:
                row_data : (pd.Series) User information
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        ps = PricingStrategy(row_data["stock_num"], row_data["content"][6:])
        result = ps.run()
        filename = row_data["username"] + row_data["subTime"] + ".png"

        alert = row_data["alertCondition"] + "未觸發"
        error = False

        if True in result["Value lose"]:
            error = True
        
        if row_data["alertCondition"] == "低於便宜價":
            for i in result["cheap"]:
                if result["NewPrice"] < i:
                    alert = "警示條件觸發: 低於便宜價"
                    break
        elif row_data["alertCondition"] == "便宜價到合理價":
            for i, j in zip(result["cheap"], result["reasonable"]):
                if (result["NewPrice"] < j) and (result["NewPrice"] > i):
                    alert = "警示條件觸發: 便宜價到合理價"
                    break
        elif row_data["alertCondition"] == "合理價到昂貴價":
            for i, j in zip(result["reasonable"], result["expensive"]):
                if (result["NewPrice"] < j) and (result["NewPrice"] > i):
                    alert = "警示條件觸發: 合理價到昂貴價"
                    break
        elif row_data["alertCondition"] == "高於昂貴價":
            for i in result["expensive"]:
                if result["NewPrice"] > i:
                    alert = "警示條件觸發: 高於昂貴價"
                    break
    
        result["alert"] = alert

        self._create_image_html(row_data["stock_num"] + "-股票定價策略", filename, result, fileStream, row_data, error)

        self._add_page(row_data["stock_num"], row_data["endTime"], result, error, filename)

    def _create_image_html(self, title : str, filename : str, result : Dict, fileStream : TextIO, table_content : Dict, error : bool) -> None:
        """Create image and html

            Args:
                title : (str) image title
                filename : (str) image name
                result : (Dict) calculate result
                fileStream : (TextIO) html file stream
                table_content : (Dict) table content
                error : (bool) Value loss
            Return:
                None
        """
        y_label = ["本益比法", "本淨比法", "高低價法", "股利法"]
        fig = make_subplots(subplot_titles = [title])
        fig.add_trace(go.Bar(y = y_label, x = result["down_cheap"], name = "便宜價", orientation = "h", marker = {"color":"#FFFF4F"}))
        fig.add_trace(go.Bar(y = y_label, x = result["cheap_reasonable"], name = "便宜價到合理價區間", orientation = "h", marker = {"color":"#59FF59"}))
        fig.add_trace(go.Bar(y = y_label, x = result["reasonable_expensive"], name = "合理價到昂貴價區間", orientation = "h", marker = {"color":"#FF5353"}))
        fig.add_trace(go.Bar(y = y_label, x = result["up_expensive"], name = "昂貴價", orientation = "h", marker = {"color":"red"}))
        fig.update_layout(barmode = 'stack')
        fig.add_vline(x = result["NewPrice"], line_width = 3, line_color = "black", annotation_text = "現在價格")
        
        fig.write_image("./image/" + filename)

        container = f'<div class="row mx-auto py-3" style="width:70vw"><div class="card p-0 mt-3"><div class="card-header text-center">{title}</div><div class="card-body">'
        container += f'<p class="card-text">股票代號: {table_content["stock_num"]}</p>'
        container += f'<p class="card-text">最新價格: {result["NewPrice"]}</p>'

        if error:
            container += f'<p class="card-text text-center" style="color:red">資料缺值部份定價法不適用</p>'
        else:
            container += f'<p class="card-text text-center" style="color:red">{result["alert"]}</p>'
        
        container += '</div>' + fig.to_html(full_html = False, include_plotlyjs = 'cdn') + '</div></div>'
        fileStream.write(container)

    def _add_page(self, ticker : str, endTime : str, result_content : Dict, error : bool, filename : str):
        """Add new page to pdf

            Args:
                ticker : (str) ticker
                endTime : (str) end of subscribe
                result_content : (Dict) content
                error : (bool) Value loss
                filename : (str) image name
            Return:
                None
        """
        sentence = [{"sentence" : f"分析報告-股票定價策略", "align" : "C"},
                {"sentence" : f"        股票代號: {ticker}", "align" : "L"},
                {"sentence" : f"        最新價格: {result_content['NewPrice']}", "align" : "L"}]
        
        if error:
            sentence.append({"sentence" : f"        資料缺值部份定價法不適用", "align" : "C"})
        else:
            sentence.append({"sentence" : f"        {result_content['alert']}", "align" : "C"})

        self._pdfMaker.make_stock_price_decision(sentence, filename)


