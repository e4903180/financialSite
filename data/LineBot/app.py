from __future__ import unicode_literals
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent
from utils.DataBaseManager import DataBaseManager
from utils.bind import Bind
import configparser
from utils.FileHandler.FileHandler import FileHandler
from linebot.models import MessageEvent, TextSendMessage

app = Flask(__name__)
db_obj = DataBaseManager()
bind_obj = Bind()

# LINE 聊天機器人的基本資料
config = configparser.ConfigParser()
config.read('config.ini')

line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))
handler = WebhookHandler(config.get('line-bot', 'channel_secret'))

FH = FileHandler(line_bot_api)

# 接收 LINE 的資訊
@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']

    body = request.get_data(as_text = True)
    app.logger.info("Request body: " + body)
    
    try:
        handler.handle(body, signature)
        
    except InvalidSignatureError:
        abort(400)

    return 'OK'

@handler.add(MessageEvent)
def handle_message(event):
    line_bot_api.reply_message(event.reply_token, TextSendMessage(text = f'收到'))
    if event.message.type == "text":
        if "/綁定帳號 " in event.message.text:
            db_obj.db.ping(True)
            bind_obj.bind_line_id(line_bot_api, db_obj.db, db_obj.cursor, event)

    elif event.message.type == "file":
        FH.handle_pdf(event)

if __name__ == "__main__":
    app.run()