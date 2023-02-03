import re
subject = "元富投顧個股報告--聯電(2303)維持買進，1H23為營運毛利率谷底，評價低"
result = re.findall(r'\(\d{4}\)', subject)
result = [ele[1:-1] for ele in result]
idx_left_brackets = subject.find(")")
idx_comma = subject.find("，")

print(subject[idx_left_brackets + 1:])
print(result)
