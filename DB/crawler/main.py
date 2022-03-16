# %%
from datetime import datetime
import crawler as cw
import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("path")
args = parser.parse_args()
# %%
rootPath = args.path + '/'

# %%
toDay = datetime.now()
crawler = cw.Crawler(toDay.year, toDay.month, rootPath)
df = crawler.start()