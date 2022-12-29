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
        ps = PricingStrategy(row_data["ticker"], row_data["content"][6:])
        result = ps.run()
        filename = row_data["username"] + row_data["subTime"] + ".png"

        self._create_image_html(row_data["ticker"] + "-定價區間", filename, result["NewPrice"], result["down_cheap"],
                            result["cheap_reasonable"], result["reasonable_expensive"], result["up_expensive"],
                            fileStream)

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
        self._add_page(row_data["ticker"], result, error, filename)

    def _create_image_html(self, title : str, filename : str, new_price : float, down_cheap : List[int], cheap_reasonable : List[int], reasonable_expensive : List[int], up_expensive : List[int], fileStream : TextIO) -> None:
        """Create image and html

            Args:
                filename : (str) image name
                new_price : (float) new price
                down_cheap : (List[int]) section under cheap price
                cheap_reasonable : (List[int]) section between cheap price and reasonable price
                reasonable_expensive : (List[int]) section between reasonable price and expensive price
                up_expensive : (List[int]) section upper expensive price
                fileStream : (TextIO) html file stream
            Return:
                None
        """
        y_label = ["本益比法", "本淨比法", "高低價法", "股利法"]
        fig = make_subplots(subplot_titles = [title])
        fig.add_trace(go.Bar(y = y_label, x = down_cheap, name = "便宜價", orientation = "h", marker = {"color":"#FFFF4F"}))
        fig.add_trace(go.Bar(y = y_label, x = cheap_reasonable, name = "便宜價到合理價區間", orientation = "h", marker = {"color":"#59FF59"}))
        fig.add_trace(go.Bar(y = y_label, x = reasonable_expensive, name = "合理價到昂貴價區間", orientation = "h", marker = {"color":"#FF5353"}))
        fig.add_trace(go.Bar(y = y_label, x = up_expensive, name = "昂貴價", orientation = "h", marker = {"color":"red"}))
        fig.update_layout(barmode = 'stack')
        fig.add_vline(x = new_price, line_width = 3, line_color = "black", annotation_text = "現在價格")
        
        fig.write_image("./image/" + filename)

        fileStream.write(fig.to_html(full_html = False, include_plotlyjs = 'cdn'))

    def _add_page(self, ticker : str, result_content : Dict, error : bool, filename : str):
        """Add new page to pdf

            Args:
                ticker : (str) ticker
                research_content : (Dict) content
                error : (bool) Value loss
                filename : (str) image name
            Return:
                None
        """
        if error:
            self._pdfMaker.make_stock_price_decision([
                {"sentence" : f"分析報告-股票定價策略", "align" : "C"},
                {"sentence" : f"        股票代號: {ticker}", "align" : "L"},
                {"sentence" : f"        最新價格: {result_content['NewPrice']}", "align" : "L"},
                {"sentence" : f"        {result_content['alert']}", "align" : "L"},
                {"sentence" : f"        資料缺值部份定價法不適用", "align" : "L"},
            ], filename)
        else:
            self._pdfMaker.make_stock_price_decision([
                {"sentence" : f"分析報告-股票定價策略", "align" : "C"},
                {"sentence" : f"        股票代號: {ticker}", "align" : "L"},
                {"sentence" : f"        最新價格: {result_content['NewPrice']}", "align" : "L"},
                {"sentence" : f"        {result_content['alert']}", "align" : "L"},
            ], filename)


