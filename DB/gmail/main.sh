#!/bin/sh
cd /home/cosbi/financialSite/DB/gmail/
python3 getGmail_main.py
python3 update2SQL.py
