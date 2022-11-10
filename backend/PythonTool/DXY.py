import yfinance as yf

print(yf.download("DX-Y.NYB", progress = False, show_errors = False))
print(yf.download("JNK", progress = False, show_errors = False))