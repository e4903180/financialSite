from linebot import LineBotApi
import pandas as pd
from linebot.models import MessageEvent, TextSendMessage

class Bind():
    def __init__(self) -> None:
        pass

    def bind_line_id(self, line_bot_api : LineBotApi, db, cursor, event : MessageEvent):
        query = "SELECT lineId FROM user WHERE username=%s"
        param = (event.message.text.split(" ")[1],)
        cursor.execute(query, param)
        db.commit()

        result = pd.DataFrame.from_dict(cursor.fetchall())

        if result.empty:
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text = "請輸入正確的username"))
            return

        if result["lineId"][0] == None:
            query = "UPDATE user SET lineId=%s WHERE username=%s"
            param = (event.source.user_id, event.message.text.split(" ")[1])
            cursor.execute(query, param)
            db.commit()
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text = f'綁定成功'))
            return
        
        line_bot_api.reply_message(event.reply_token, TextSendMessage(text = f'此line帳號已經綁定，如有問題請洽管理員'))