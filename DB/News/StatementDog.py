from NewsBase import NewsBase
from typing import Any
import requests
import pandas as pd
from tqdm import tqdm
import sys

class StatementDog(NewsBase):
    """Update news from https://statementdog.substack.com/

        Args :
            db : (Any) database connection
            cursor : (Any) database cursor
        Return :
            None
    """
    def __init__(self, db : Any, cursor : Any) -> None:
        super().__init__()
        self._db = db
        self._cursor = cursor

    def run(self):
        """Run

            Args :
                None

            Return :
                None 
        """
        page = 0
        stop = False

        print("\n財報狗", file = sys.stderr)

        while not stop:
            r = requests.get(f"https://statementdog.substack.com/api/v1/archive?sort=new&search=&offset={page * 12}&limit=12")
            datas = r.json()

            for data in tqdm(datas):
                title_idx = data["title"].find(" ")

                if self._isDuplicate(data["title"][title_idx + 1:]):
                    stop = True
                    break

                self._insert(data["title"][title_idx + 1:], data["canonical_url"], data["post_date"][:10])
            page += 1
    
    def _insert(self, title : str, link : str, date : str) -> None:
        """Insert article detail to DB

            Args :
                title : (str) article title
                link : (str) article link
                date : (str) date
            Return:
                None
        """
        query = 'INSERT INTO news (`title`, `repoter`, `link`, `date`, `category`) \
            VALUES(%s, %s, %s, %s, %s)'
        param = (title, "無", link, date, "財報狗")

        self._cursor.execute(query, param)
        self._db.commit()

    def _isDuplicate(self, title : str) -> bool:
        """Check if data duplicate

            Args :
                title : (str) article title

            Return:
                bool
        """
        query = f'SELECT * FROM news WHERE title="{title}"'

        self._cursor.execute(query)
        self._db.commit()

        result = pd.DataFrame.from_dict(self._cursor.fetchall())

        if result.empty:
            return False
        return True