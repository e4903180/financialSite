import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/zh-tw';
import axios from 'axios';
import { config } from '../../constant';
import { columns_twse } from '../column/column';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calender.css"
import { Backdrop, CircularProgress } from '@mui/material';

function CalendarItem() {
    const init_year = new Date().getFullYear()
    const init_month = String(new Date().getMonth() + 1).padStart(2, '0')

    moment.locale('zh-tw')
    const localizer = momentLocalizer(moment)
    const [data, setData] = useState([])
    const [event, setEvent] = useState([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/calender_search", { params: {
            "stock_num_name" : "", 
            "startDate" : `${init_year}-${init_month}-01`,
            "endDate" : `${init_year}-${init_month}-31` 
        }})
        .then(res => {
            setPage(0)
            setData(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(config["rootApiIP"] + "/data/calender", {
            params: {
                "year" : init_year,
                "month" : init_month
            }
        })
        .then(res => {
            setEvent(res.data)
            setLoading(false)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    function clickEvent(info){
        window.open(config["rootPathPrefix"] + "/database/search/" + info.title, '_blank', 'noopener,noreferrer')
    }

    const navigateHandle = (newDate) => {
        setLoading(true)
        const year = newDate.getFullYear()
        const month = String(newDate.getMonth() + 1).padStart(2, '0')

        axios.get(config["rootApiIP"] + "/data/calender_search", { params: {
            "stock_num_name" : "", 
            "startDate" : `${year}-${month}-01`,
            "endDate" : `${year}-${month}-31` 
        }})
        .then(res => {
            setPage(0)
            setData(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(config["rootApiIP"] + "/data/calender", {
            params: {
                "year" : year,
                "month" : month
            }
        })
        .then(res => {
            setEvent(res.data)
            setLoading(false)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
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

            <div className='row py-3 mx-auto'>
                <div className = 'col-md-10 mx-auto' style = {{height:"800px"}}>
                    <Calendar
                        localizer = {localizer}
                        events = {event}
                        onSelectEvent = {clickEvent}
                        onNavigate = {(newDate) => navigateHandle(newDate)}
                        popup = {true}
                        views = {["month"]}
                    />
                </div>
            </div>

            <div className = 'row py-3 mx-auto'>
                <h2 className = 'text-center'>法說會詳細資訊</h2>
                
                <div className = 'col-md-10 mx-auto'>
                    <DataGrid
                        style = {{height : "70vh"}}
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

export default CalendarItem;