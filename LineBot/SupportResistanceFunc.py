import json
import time
from SupportResistance import SupportResistance
from linebot.models import TextSendMessage

SP = SupportResistance()

def run(line_bot_api : object, stock_num : str, start_date : str, ma_type : str, ma_len : int) -> None:
    while(True):
        return_msg = "股票代碼" + stock_num + "\n"

        SP.get_data(stock_num, start_date, ma_type, ma_len)
        result1 = json.loads(SP.method1())

        SP.get_data(stock_num, start_date, ma_type, ma_len)
        result2 = json.loads(SP.method2())

        SP.get_data(stock_num, start_date, ma_type, ma_len)
        result3 = json.loads(SP.method3())

        if result1["Kline"][-1][4] < result1["support"][-1][1]:
            return_msg += "Method1結果收盤價小於地板線\n"
        elif result1["Kline"][-1][4] > result1["resistance"][-1][1]:
            return_msg += "Method1結果收盤價大於天花板線\n"
        else:
            return_msg += "Method1結果收盤價位於天花板線及地板線中間\n"

        if result2["Kline"][-1][4] < result2["support"][-1][1]:
            return_msg += "Method2結果收盤價小於地板線\n"
        else:
            return_msg += "Method2結果收盤價大於地板線\n"

        if result3["Kline"][-1][4] < result3["support1"][-1][1]:
            return_msg += "Method3結果收盤價小於1%地板線\n"
        else:
            return_msg += "Method3結果收盤價大於1%地板線\n"
        
        if result3["Kline"][-1][4] < result3["support2"][-1][1]:
            return_msg += "Method3結果收盤價小於5%地板線"
        else:
            return_msg += "Method3結果收盤價大於5%地板線"

        line_bot_api.broadcast(TextSendMessage(text = return_msg))

        time.sleep(60)

if __name__ == "__main__":
    run("2330", "2017-01-01", "wma", 20)