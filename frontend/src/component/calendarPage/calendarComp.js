import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { rootApiIP } from '../../constant'

function CalendarComp() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get( rootApiIP + "/data/calender")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    function clickEvent(info){
        window.open("http://140.116.214.154:8080/allSearch/" + info.event.title.slice(0, 4))
    }

    return (
        <>
            <div className = 'row mt-3 mx-auto text-center'>
                <h1>法說會行事曆</h1>
            </div>

            <div className = 'row mt-3 mx-auto'>
                <div className = 'col-md-6 mx-auto'>
                    <FullCalendar
                        height = { 600 }
                        plugins={[ dayGridPlugin ]}
                        initialView = "dayGridMonth"
                        events = { data }
                        dayMaxEventRows = { 2 }
                        eventClick = { clickEvent }
                        eventMouseEnter = { info => info.el.style.cursor = "pointer" }
                    />
                </div>
            </div>
        </>
    );
}

export default CalendarComp;