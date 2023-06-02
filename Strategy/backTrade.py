import requests
import backtrader as bt
import yfinance as yf
import pandas as pd
from datetime import timedelta, datetime

class TestStrategy(bt.Strategy):
    def __init__(self) -> None:
        self.size = 0

    def next(self) -> None:
        if not self.position:
            self.buy(
                exectype = bt.Order.Stop,
                price = self.data.close[0] * 0.9,
                size = int(self.broker.get_cash() / self.data.close[0])
            )


class Test():
    def __init__(self) -> None:
        self.cerebro = bt.Cerebro()
        self.cerebro.broker.setcash(100000.0)

    def _get_yahoo_finance_data(self, stock_num : str, start_date : str) -> pd.DataFrame:
        end = (datetime.strptime(start_date, '%Y-%m-%d') + timedelta(weeks=4)).strftime('%Y-%m-%d')
        result = yf.download(f"{stock_num}.TW", start = start_date, end = end, progress = False, show_errors = False)

        if result.empty:
            return yf.download(f"{stock_num}.TWO", start = start_date, end = end, progress = False, show_errors = False)
        
        return result

    def run(self) -> None:
        print('Starting Portfolio Value: %.2f' % self.cerebro.broker.getvalue())

        self.cerebro.addstrategy(TestStrategy)
        data = self._get_yahoo_finance_data("2408", "2023-01-18")
        self.cerebro.adddata(bt.feeds.PandasData(dataname = data))

        self.cerebro.run()
        print('Final Portfolio Value: %.2f' % self.cerebro.broker.getvalue())
        self.cerebro.plot(style = 'candle')

if __name__ == "__main__":
    test = Test()
    test.run()