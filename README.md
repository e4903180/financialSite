# shell script
30 1 * * * sh /home/uikai/financialSite/data/DB/crawler/twse/twseCrawler.sh

1 0 * * * sh /home/uikai/financialSite/data/DB/SubExpire/subExpireDayUpdate.sh

0 15 * * * sh /home/uikai/financialSite/data/DB/TWII/TwiiDayUpdate.sh

0 10 26-28 * * sh /home/uikai/financialSite/data/DB/FRED/FredMonthUpdate.sh

0 7 * * 2,3,4,5,6 sh /home/uikai/financialSite/data/DB/FRED/FredDayUpdate.sh

5 7,12,18 * * * sh /home/uikai/financialSite/data/DB/News/newsDayUpdate.sh

0 17 * * * sh /home/uikai/financialSite/data/AlertService/alert.sh

0 10,18 * * * sh /home/uikai/financialSite/data/DB/gmail/gmailHandle.sh

15 18 * * * sh /home/uikai/financialSite/data/DB/gmail/gmailOtherHandle.sh

0 6 * * 7 sh /home/uikai/financialSite/data/DB/crawler/tickerList/tickerListUpdate.sh

0 2,7,10,12,18 * * * sh /home/uikai/financialSite/data/DB/TableStatus/TableStatus.sh

59 23 * * * sh /home/uikai/financialSite/data/DB/gmail/lineHandle.sh