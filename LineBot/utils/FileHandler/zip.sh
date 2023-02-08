#!/bin/sh

cd /home/cosbi/financialSite/LineBot/utils/FileHandler/unzip
today=$(date +'%Y%m%d')

zip -r ../zip/$today.zip ./$today