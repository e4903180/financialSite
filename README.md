# shell script
30 1 * * * sh /home/uikai/financialSite/DB/crawler/twse/twseCrawler.sh
30 1 * * * sh /home/uikai/financialSite/DB/SubExpire/subExpireDayUpdate.sh
0 15 * * * sh /home/uikai/financialSite/DB/TWII/TwiiDayUpdate.sh
0 10 26-28 * * sh /home/uikai/financialSite/DB/FRED/FredMonthUpdate.sh
0 7 * * 2,3,4,5,6 sh /home/uikai/financialSite/DB/FRED/FredDayUpdate.sh
0 7,12,18 * * * sh /home/uikai/financialSite/DB/News/newsDayUpdate.sh
0 17 * * * sh /home/uikai/financialSite/AlertService/alert.sh
0 10,18 * * * sh /home/uikai/financialSite/DB/gmail/gmailHandle.sh
15 18 * * * sh /home/uikai/financialSite/DB/gmail/get_gmail_other.sh
0 6 * * 7 sh /home/uikai/financialSite/DB/crawler/tickerList/tickerListUpdate.sh
0 2,7,10,12,18 * * * sh /home/uikai/financialSite/DB/TableStatus/TableStatus.sh
59 23 * * * sh /home/uikai/financialSite/DB/gmail/lineHandle.sh

# cosbi5 mySQL
mysql -u financialSite -h 140.116.214.134 -P 3306 -p  
6x4xxxxxx