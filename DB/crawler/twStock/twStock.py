from utils.finlabTool import crawl_price
from datetime import datetime

class TwStock():
    def __init__(self) -> None:
        pass

    def get_price(self) -> None:
        now = datetime.now()

        result = crawl_price(now)
        # print(result)

if __name__ == "__main__":
    TS = TwStock()

    TS.get_price()