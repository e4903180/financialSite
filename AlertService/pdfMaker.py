from fpdf import FPDF
from typing import List, Dict
import warnings
warnings.filterwarnings("ignore")

class FPDF(FPDF):
    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("MicrosoftJhengHei", size = 8)
        self.cell(0, 10, "Cosbi financial produced", 0, 0, 'C')


class PdfMaker():
    def __init__(self, username : str) -> None:
        self.pdf = FPDF()
        self.pdf.add_font('MicrosoftJhengHei', '', 'MicrosoftJhengHei.ttf', True)
        self.username = username

    def make_support_resistance(self, datas : List[Dict], image : str) -> None:
        self.pdf.add_page()
        self.pdf.set_fill_color(r = 231, g = 255, b = 255)

        self.pdf.set_font("MicrosoftJhengHei", size = 24)
        self.pdf.cell(190, 20, txt = datas[0]["sentence"], ln = 1, align = datas[0]["align"], fill = True)
        self.pdf.line(20, 28, 190, 28)
        self.pdf.set_font("MicrosoftJhengHei", size = 12)

        for i in range(1, len(datas), 1):
            self.pdf.cell(190, 12, txt = datas[i]["sentence"], ln = 1, align = datas[i]["align"], fill = True)

        self.pdf.image("./image/" + image, x = 5, y = 130, w = 200, h = 130, type = "png")

    def make_per_river(self, datas : List[Dict], filenameKline : str, filenameBar : str) -> None:
        self.pdf.add_page()
        self.pdf.set_fill_color(r = 231, g = 255, b = 255)

        self.pdf.set_font("MicrosoftJhengHei", size = 24)
        self.pdf.cell(190, 20, txt = datas[0]["sentence"], ln = 1, align = datas[0]["align"], fill = True)
        self.pdf.line(20, 28, 190, 28)
        self.pdf.set_font("MicrosoftJhengHei", size = 12)

        for i in range(1, len(datas), 1):
            self.pdf.cell(190, 12, txt = datas[i]["sentence"], ln = 1, align = datas[i]["align"], fill = True)

        self.pdf.image(f"./image/{filenameBar}", x = 5, y = 100, w = 200, h = 120, type = "png")
        self.pdf.image(f"./image/{filenameKline}", x = 5, y = 180, w = 200, h = 120, type = "png")

    def make_stock_price_decision(self, datas : List[Dict], filename : str) -> None:
        self.pdf.add_page()
        self.pdf.set_fill_color(r = 231, g = 255, b = 255)

        self.pdf.set_font("MicrosoftJhengHei", size = 24)
        self.pdf.cell(190, 20, txt = datas[0]["sentence"], ln = 1, align = datas[0]["align"], fill = True)
        self.pdf.line(20, 28, 190, 28)
        self.pdf.set_font("MicrosoftJhengHei", size = 12)

        for i in range(1, len(datas), 1):
            self.pdf.cell(190, 12, txt = datas[i]["sentence"], ln = 1, align = datas[i]["align"], fill = True)

        self.pdf.image(f"./image/{filename}", x = 5, y = 130, w = 200, h = 130, type = "png")
        
    def output(self):
        self.pdf.output(f"./pdf/{self.username}-分析報告.pdf")

if __name__ == "__main__":
    PM = PdfMaker()

    PM.make([
            {"sentence" : "分析報告-天花板地板線", "align" : "C"},
            {"sentence" : "        股票代號: 2330", "align" : "L"},
            {"sentence" : "        起始日期: 2017/01/01", "align" : "L"},
            {"sentence" : "        ma: 20wma", "align" : "L"},
            {"sentence" : "        計算方式: 方法一", "align" : "L"},
            {"sentence" : "突破地板線觸發!!!", "align" : "C"},
        ])