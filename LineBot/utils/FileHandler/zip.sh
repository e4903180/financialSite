#!/bin/sh
cd "/home/cosbi/桌面/financialData/unzip"
today=$(date +'%Y%m%d')

if [ -d "./$today" ]; then
    zip -r ../zip/$today.zip ./$today
fi