from typing import Any, Dict
from datetime import date
from .compress2SQL import Compress2SQL
import os

class FileHandler():
    def __init__(self, line_bot_api : Any) -> None:
        self._api = line_bot_api

    def handle_pdf(self, event : Dict, db, cursor) -> None:
        c2sql = Compress2SQL(db, cursor)
        message_content = self._api.get_message_content(event.message.id)
        dir = f"./utils/FileHandler/unzip/{date.today().strftime('%Y%m%d')}"

        if not os.path.isdir(dir):
            os.mkdir(dir)

        if ".pdf" in event.message.file_name:
            with open(f"{dir}/{event.message.file_name}", 'wb') as fd:
                for chunk in message_content.iter_content():
                    fd.write(chunk)
        elif ((".zip" in event.message.file_name) or
              (".rar" in event.message.file_name)):
            with open(f"./utils/FileHandler/compress/{event.message.file_name}", 'wb') as fd:
                for chunk in message_content.iter_content():
                    fd.write(chunk)
            c2sql.run()