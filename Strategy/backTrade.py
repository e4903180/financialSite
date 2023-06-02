import requests
import backtrader as bt
import yfinance as yf
import pandas as pd

class TestStrategy(bt.Strategy):
    def __init__(self) -> None:
        self.isBuy = False
    
    def next(self) -> None:
        if not self.isBuy:
            self.order = self.buy()
            self.isBuy = ~ self.isBuy
        
        if (len(self) - self.bar_executed + 1) == 7:
            self.order = self.sell()


class Test():
    def __init__(self) -> None:
        self.cerebro = bt.Cerebro()
        self.cerebro.broker.setcash(10000.0)

    def _get_yahoo_finance_data(self, stock_num : str, start_date : str) -> pd.DataFrame:
        result = yf.download(f"{stock_num}.TW", start = start_date, progress = False, show_errors = False)

        if result.empty:
            return yf.download(f"{stock_num}.TWO", start = start_date, progress = False, show_errors = False)
        
        return result

    def run(self) -> None:
        print('Starting Portfolio Value: %.2f' % self.cerebro.broker.getvalue())

        self.cerebro.addstrategy(TestStrategy)
        self.cerebro.adddata(bt.feeds.PandasData(self._get_yahoo_finance_data(stock_num, start_date)))

        print('Final Portfolio Value: %.2f' % self.cerebro.broker.getvalue())

if __name__ == "__main__":
    test = Test()
    test.run()