#!/bin/sh

cd /home/cosbi/financialSite/LineBot/utils/FileHandler/unzip
today=$(date +'%Y%m%d')

if [ -d "/home/cosbi/financialSite/LineBot/utils/FileHandler/unzip/$today.zip" ]; then
    zip -r ../zip/$today.zip ./$today
fi