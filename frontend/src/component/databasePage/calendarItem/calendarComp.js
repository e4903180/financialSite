import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { config } from '../../../constant';
import { columns_twse } from '../../column/column';
import { Backdrop, CircularProgress } from '@mui/material';

function CalenderComp() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setLoading(true)

        axios.post(config["rootApiIP"] + "/data/calenderData", { "year" : year, "month" : month })
        .then(res => {
            setPage(0)
            setData(res.data)
            setLoading(false)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
        
    }, [year, month])

    function clickEvent(info){
        window.open(config["rootPathPrefix"] + "/database/search/" + info.event.title, '_blank', 'noopener,noreferrer')
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
            <Backdrop
                sx = {{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { loading }
            >
                資料載入中&emsp;
                <CircularProgress color = "inherit" />
            </Backdrop>

            <div className = 'row py-3 mx-auto'>
                <h1 className = 'text-center'>法說會行事曆</h1>

                <div className = 'col-md-8 mx-auto'>
                    <FullCalendar
                        height = { "auto" }
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

            <div className = 'row mt-3 mx-auto'>
                <h2 className = 'text-center'>法說會詳細資訊</h2>
                
                <div className = 'col-md-10 mx-auto' style = {{height : "800px"}}>
                    <DataGrid
                        columns = { columns_twse }
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
                    />
                </div>
            </div>
        </>
    );
}

export default CalenderComp;