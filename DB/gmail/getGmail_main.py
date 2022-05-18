#!/usr/bin/env python
# coding: utf-8

# In[1]:


import getGmail_Class
import os, sys, logging
from tqdm import trange
from datetime import datetime
import pandas as pd
import re


# In[2]:


gGC = getGmail_Class.gmailService()


# In[3]:


Num, Name, investment_company, Date, Path, ID, recommendResult = [[] for i in range(7)]

FORMAT = '%(asctime)s %(levelname)s: %(message)s'
logging.basicConfig(level = logging.INFO, filename = "/home/cosbi/桌面/financialData/gmailData/log/" + datetime.now().strftime("%Y_%m_%d") + '.log', filemode = 'w', format = FORMAT)
logging.info('Updating email start')

# request a list of all the messages
result = gGC.service.users().messages().list(userId = 'me', maxResults = 500, labelIds = ["INBOX"]).execute()
messages = result.get('messages')

if messages == None:
    logging.info('Inbox quantity is 0')
    logging.info('Updating email end')
    sys.exit(0)

# get mail ID from messages
for i in range(len(messages)):
    ID.append(messages[i]['id'])

# iterate through all the messages
for i in trange(len(ID)):
    # Get the message from its id
    txt = gGC.service.users().messages().get(userId = 'me', id = ID[i]).execute()
    payload = txt['payload']
    headers = payload['headers']
    date = gGC.getDate(headers)
    subject = gGC.getSubject(headers)
    stock_num = gGC.verifySubject(subject)

    if len(stock_num) != 0:
        tempNum, tempName, tempInvestment_company, tempPath = gGC.getResearch_report(subject, stock_num, payload, ID[i], date)
        temp_recommendResult = gGC.recommend(subject, tempNum)
        recommendResult.extend(temp_recommendResult)
        
        if len(tempNum) != 0:
            for j in range(len(tempNum)):
                Num.append(tempNum[j])
                Name.append(tempName[j])
                Date.append(date)
                investment_company.append(tempInvestment_company)
                Path.append(tempPath[j])
                
        # Modify labels
        gGC.modifyLabels(ID[i], "Label2")
    else:
        # Modify labels
        gGC.modifyLabels(ID[i], "Label3")

df = pd.DataFrame({ "Number" : Num, "Name" : Name, "Investment company" : investment_company, "Date" : Date, "File path" : Path, "Recommend" : recommendResult })

logging.info('Updating email end')


# In[6]:


csvName = datetime.now().strftime("%Y_%m_%d") + ".csv"
df.to_csv("/home/cosbi/桌面/financialData/gmailData/dataFrame/" + csvName, index = False)

