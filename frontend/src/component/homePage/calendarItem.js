import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { rootApiIP } from '../../constant'

function CalendarItem() {
    function clickEvent(info){
        window.open("/database/search/" + info.event.title, '_blank', 'noopener,noreferrer')
    }

    async function getCalendarData(fetchInfo, successCallback, failureCallback) {
        try {
            let temp_year = fetchInfo.start.getFullYear()
            let temp_month = (fetchInfo.start.getMonth() + 1).toString().padStart(2, '0');

            const response = await axios.post(rootApiIP + "/data/calender", { "year" : temp_year, "month" : temp_month })

            successCallback(
                response.data.map(event => {
                    return ({
                        title: event.title,
                        start: event.date.slice(0, 10),
                    });
                })
            );
        } catch (error) {
            if(error.response.data === "Session expired") window.location.reload()
            failureCallback(error)
        }
    }
    
    return (
        <>
            <div className = 'row mt-3 mx-auto'>
                <div className = 'col-md-8 mx-auto'>
                    <FullCalendar
                        plugins={[ dayGridPlugin ]}
                        initialView = "dayGridMonth"
                        events = { (fetchInfo, successCallback, failureCallback) => getCalendarData(fetchInfo, successCallback, failureCallback) }
                        dayMaxEventRows = { 3 }
                        eventClick = { clickEvent }
                        eventMouseEnter = { info => info.el.style.cursor = "pointer" }
                        showNonCurrentDates = { false }
                        fixedWeekCount = { false }
                    />
                </div>
            </div>
        </>
    );
}

export default CalendarItem;