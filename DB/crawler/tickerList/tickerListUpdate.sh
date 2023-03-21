#!/bin/sh
cd /home/uikai/financialSite/DB/crawler/tickerList
/home/uikai/anaconda3/bin/python tickerListUpdate.py
/home/uikai/anaconda3/bin/python updateTickerList.py