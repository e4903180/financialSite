from fpdf import FPDF
from typing import List, Dict
import warnings
import json
warnings.filterwarnings("ignore")
root_path = json.load(open("../root_path.json"))

class FPDF(FPDF):
    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("MicrosoftJhengHei", size = 8)
        self.cell(0, 10, "Cosbi financial produced", 0, 0, 'C')


class PdfMaker():
    """Create research pdf
    """
    def __init__(self, username : str) -> None:
        self.pdf = FPDF()
        self.pdf.add_font('MicrosoftJhengHei', '', 'MicrosoftJhengHei.ttf', True)
        self.username = username

    def make_support_resistance(self, datas : List[Dict], image : str) -> None:
        """Create support resistance page

            Args :
                datas : (List[Dict]) table content
                image : (str) image filename
            Return :
                None
        """
        self.pdf.add_page()
        self.pdf.set_fill_color(r = 231, g = 255, b = 255)

        self.pdf.set_font("MicrosoftJhengHei", size = 24)
        self.pdf.cell(190, 20, txt = datas[0]["sentence"], ln = 1, align = datas[0]["align"], fill = True)
        self.pdf.line(20, 28, 190, 28)
        self.pdf.set_font("MicrosoftJhengHei", size = 12)

        for i in range(1, len(datas), 1):
            self.pdf.cell(190, 12, txt = datas[i]["sentence"], ln = 1, align = datas[i]["align"], fill = True)

        self.pdf.image(f"{root_path['ALTERSERVICE_IMAGE_PATH']}/{image}", x = 5, y = 130, w = 200, h = 130, type = "png")

    def make_per_river(self, datas : List[Dict], filenameKline : str, filenameBar : str) -> None:
        """Create per river page

            Args :
                datas : (List[Dict]) table content
                filenameKline : (str) kline image filename
                filenameBar : (str) bar image filename
            Return :
                None
        """
        self.pdf.add_page()
        self.pdf.set_fill_color(r = 231, g = 255, b = 255)

        self.pdf.set_font("MicrosoftJhengHei", size = 24)
        self.pdf.cell(190, 20, txt = datas[0]["sentence"], ln = 1, align = datas[0]["align"], fill = True)
        self.pdf.line(20, 28, 190, 28)
        self.pdf.set_font("MicrosoftJhengHei", size = 12)

        for i in range(1, len(datas), 1):
            self.pdf.cell(190, 12, txt = datas[i]["sentence"], ln = 1, align = datas[i]["align"], fill = True)

        self.pdf.image(f"{root_path['ALTERSERVICE_IMAGE_PATH']}/{filenameBar}", x = 5, y = 100, w = 200, h = 120, type = "png")
        self.pdf.image(f"{root_path['ALTERSERVICE_IMAGE_PATH']}/{filenameKline}", x = 5, y = 160, w = 200, h = 120, type = "png")

    def make_stock_price_decision(self, datas : List[Dict], filename : str) -> None:
        """Create stock price decision page

            Args :
                datas : (List[Dict]) table content
                filename : (str) image filename
            Return :
                None
        """
        self.pdf.add_page()
        self.pdf.set_fill_color(r = 231, g = 255, b = 255)

        self.pdf.set_font("MicrosoftJhengHei", size = 24)
        self.pdf.cell(190, 20, txt = datas[0]["sentence"], ln = 1, align = datas[0]["align"], fill = True)
        self.pdf.line(20, 28, 190, 28)
        self.pdf.set_font("MicrosoftJhengHei", size = 12)

        for i in range(1, len(datas), 1):
            self.pdf.cell(190, 12, txt = datas[i]["sentence"], ln = 1, align = datas[i]["align"], fill = True)

        self.pdf.image(f"{root_path['ALTERSERVICE_IMAGE_PATH']}/{filename}", x = 5, y = 130, w = 200, h = 130, type = "png")
        
    def output(self) -> None:
        """Output pdf

            Args :
                None
            Return :
                None
        """
        self.pdf.output(f"{root_path['ALTERSERVICE_PDF_PATH']}/{self.username}-分析報告.pdf")