import twstock

stock_info = twstock.realtime.get("2330")

bid = stock_info["realtime"]["best_bid_price"][-1]
ask = stock_info["realtime"]["best_ask_price"][-1]
print(bid, ask)