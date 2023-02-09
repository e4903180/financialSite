# financialSite
登入系統不完善：前端的超時處理, 使用者登入狀態

# 上線
1. 上線要設定http-proxy-middleware (./frontend/src/setupProxy.js) 不然CRA會主動連到localhost
2. 開發模式跟上線config要分開

# shell script
30 1 * * * sh /home/cosbi/financialSite/DB/crawler/twse/twseCrawler.sh
30 1 * * * sh /home/cosbi/financialSite/DB/SubExpire/subExpireDayUpdate.sh
0 15 * * * sh /home/cosbi/financialSite/DB/TWII/TwiiDayUpdate.sh
0 10 26-28 * * sh /home/cosbi/financialSite/DB/FRED/FredMonthUpdate.sh
0 7 * * 2,3,4,5,6 sh /home/cosbi/financialSite/DB/FRED/FredDayUpdate.sh
30 8 * * * sh /home/cosbi/financialSite/DB/News/newsDayUpdate.sh
0 7,12,18 * * * sh /home/cosbi/financialSite/DB/News/newsDayUpdate.sh
0 17 * * * sh /home/cosbi/financialSite/AlertService/alert.sh
0 7,18 * * * sh /home/cosbi/financialSite/DB/gmail/main.sh
59 23 * * * sh /home/cosbi/financialSite/LineBot/utils/FileHandler/zip.sh