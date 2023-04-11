import json

result = json.load(open("recommend.json"))

with open("convertedRecommend.json", "w", encoding = "utf-8") as outfile:
    outfile.write(json.dumps(result, indent = 4))