#!/bin/sh

today=$(date +'%Y%m%d')

if [ -d "/home/cosbi/桌面/financialData/unzip/$today.zip" ]; then
    zip -r /home/cosbi/桌面/financialData/zip/$today.zip /home/cosbi/桌面/financialData/$today
fi