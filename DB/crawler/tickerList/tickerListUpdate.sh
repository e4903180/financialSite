#!/bin/sh
cd /home/cosbi/financialSite/DB/crawler/tickerList
/home/uikai/anaconda3/bin/python tickerListUpdate.py

cd /home/cosbi/financialSite/DB/gmail/src
/home/uikai/anaconda3/bin/python updateTickerList.py