import re
print(re.findall(r'\d{4}(?=[^\d\/\年\.])', "20230116"))
