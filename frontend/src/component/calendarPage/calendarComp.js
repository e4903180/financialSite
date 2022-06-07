import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

function CalendarComp() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/calender")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <div className = 'row mt-3 mx-auto text-center'>
                <h1>法說會行事曆</h1>
            </div>

            <div className = 'row mt-3 mx-auto'>
                <div className = 'col-md-6 col-sm-7 mx-auto'>
                    <FullCalendar
                        height = { 600 }
                        plugins={[ dayGridPlugin ]}
                        initialView = "dayGridMonth"
                        events = { data }
                        dayMaxEventRows = { 2 }
                    />
                </div>
            </div>
        </>
    );
}

export default CalendarComp;