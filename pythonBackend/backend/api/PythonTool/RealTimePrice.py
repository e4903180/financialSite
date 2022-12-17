import json
import twstock
import sys
import json

param = sys.argv[1].split(",")

result = twstock.realtime.get(param)

RealTimePrice = { "RealTimePrice" : [] }
for ele in param:
    if result[ele]["realtime"]["latest_trade_price"] == "-":
        RealTimePrice["RealTimePrice"].append(0.00)
    else:
        RealTimePrice["RealTimePrice"].append(round(float(result[ele]["realtime"]["latest_trade_price"]), 2))

json1 = json.dumps(RealTimePrice)
print(json1)
sys.stdout.flush()