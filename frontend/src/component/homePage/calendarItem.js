import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { config } from '../../constant';
import { columns4 } from '../column/column';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function CalendarItem() {
    const [data, setData] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        axios.post(config["rootApiIP"] + "/data/calenderData", { "year" : year, "month" : month })
        .then(res => {
            setPage(0)
            setData(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [year, month])

    function clickEvent(info){
        window.open(config["rootPathPrefix"] + "/home/search/" + info.event.title, '_blank', 'noopener,noreferrer')
    }

    async function getCalendarData(fetchInfo, successCallback, failureCallback) {
        try {
            let temp_year = fetchInfo.start.getFullYear()
            let temp_month = (fetchInfo.start.getMonth() + 1).toString().padStart(2, '0');

            setYear(temp_year)
            setMonth(temp_month)

            const response = await axios.post(config["rootApiIP"] + "/data/calender", { "year" : temp_year, "month" : temp_month })

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

            <div className = 'row mt-5 mx-auto text-center'>
                <h2>法說會詳細資訊</h2>
            </div>

            <div className = 'row mt-3 mx-auto' style = {{minheight : "600px"}}>
                <div className = 'col-md-10 mx-auto'>
                    <DataGrid
                        columns = { columns4 }
                        rows = { data }
                        page = { page }
                        onPageChange = {(newPage) => setPage(newPage)}
                        pageSize = { pageSize }
                        onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 20]}
                        getRowId = { row => row.ID }
                        components = {{ Toolbar: GridToolbar }}
                        componentsProps = {{ toolbar: { showQuickFilter: true },}}
                        pagination
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                        autoHeight = { true }
                    />
                </div>
            </div>
        </>
    );
}

export default CalendarItem;