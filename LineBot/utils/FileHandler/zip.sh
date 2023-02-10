#!/bin/sh

today=$(date +'%Y%m%d')

if [ -d "/home/cosbi/桌面/financialData/unzip/$today" ]; then
    zip -r /home/cosbi/桌面/financialData/zip/$today.zip /home/cosbi/桌面/financialData/unzip/$today
fi