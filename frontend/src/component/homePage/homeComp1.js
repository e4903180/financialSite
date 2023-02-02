import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant'
import axios from 'axios';
import NewsItem from './newsItem';
import ReasearchItem from './researchItem';
import CalendarItem from './calendarItem';

function HomeComp1() {
    const [type, setType] = useState("news")
    const [news, setNews] = useState([[], [], []])
    const [research, setResearch] = useState([])

    useEffect(() => {
        axios.get(rootApiIP + "/data/newestNews25")
        .then(res => {
            setNews(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(rootApiIP + "/data/newestResearch25")
        .then(res => {
            setResearch(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto'>
                <div className = 'col-md-11 mx-auto py-3'>
                    <h3 className = "display-5 text-center">快速瀏覽</h3>

                    <div className = "card h-100 p-0 mt-3">
                        <div className = 'mx-3 mt-2'>
                            <ul className = "nav nav-tabs">
                                <li className = "nav-item">
                                    <button className = "nav-link active" data-bs-toggle = "tab" onClick = {() => setType("news")}>新聞</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("research")}>個股研究報告</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("calendar")}>法說會行事曆</button>
                                </li>
                            </ul>

                            { type === "news" && <NewsItem data = { news } />}
                            { type === "research" && <ReasearchItem data = { research } />}
                            { type === "calendar" && <CalendarItem />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeComp1;