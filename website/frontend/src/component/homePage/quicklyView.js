import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import CalendarItem from './calendarItem';
import DbSearchItem from './dbSearchItem';
import NewsItem from './newsItem';
import ReasearchItem from './researchItem';

function QuicklyView() {
    const [type, setType] = useState("news")
    const [news, setNews] = useState([])
    const [research, setResearch] = useState([])

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/newestNews20")
        .then(res => {
            setNews(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(config["rootApiIP"] + "/data/newestResearch20")
        .then(res => {
            setResearch(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto'>
                <div className = 'col-md-11 mx-auto py-3'>
                    <h3 className = "display-6 text-center">資料庫快速瀏覽</h3>
                    <div className = "card p-0 mt-3">
                        <div className = 'mx-3 mt-2'>
                            <ul className = "nav nav-tabs">
                                <li className = "nav-item">
                                    <button className = "nav-link active" data-bs-toggle = "tab" onClick = {() => setType("news")}>新聞</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("research")}>研究報告</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("calendar")}>法說會行事曆</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("dbSearch")}>綜合資料庫查詢</button>
                                </li>
                            </ul>

                            <div className = "tab-content">
                                { type === "news" && <NewsItem data = { news } />}
                                { type === "research" && <ReasearchItem data = { research } />}
                                { type === "calendar" && <CalendarItem />}
                                { type === "dbSearch" && <DbSearchItem /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default QuicklyView;