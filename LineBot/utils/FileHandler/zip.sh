#!/bin/sh
cd "/home/uikai/financialData/unzip"
today=$(date +'%Y%m%d')

if [ -d "./$today" ]; then
    zip -r ../zip/$today.zip ./$today
fi