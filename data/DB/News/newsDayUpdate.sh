#!/bin/sh
cd /home/uikai/financialSite/data/DB/News
python3 newsDayUpdate.py

cd /home/uikai/financialSite/data/DB/PopularNews
python3 popularNews.py