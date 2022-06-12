import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { rootApiIP } from '../../constant'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function CalendarComp() {
    const [data, setData] = useState([])
    const [year1, setYear1] = useState(new Date().getFullYear())
    const [month1, setMonth1] = useState(new Date().getMonth() + 1)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        axios.post(rootApiIP + "/data/calenderData", { "year" : year1, "month" : month1 })
        .then(res => {
            setData(res.data)
        })
    }, [year1, month1])

    function clickEvent(info){
        window.open("http://140.116.214.154:8080/allSearch/" + info.event.title.slice(0, 4))
    }

    async function getCalendarData(fetchInfo, successCallback) {

        try {
            let year = new Date().getFullYear();
            let month = new Date().getMonth() + 1;
        
            if (fetchInfo) {
                year = new Date(fetchInfo.start).getFullYear();
                month = new Date(fetchInfo.start).getMonth() + 1;
            }

            setYear1(year)
            setMonth1(month)

            const response = await axios.post(rootApiIP + "/data/calender", { "year" : year, "month" : month })

            successCallback(
                response.data.map(event => {
                    return ({
                        title: event.title,
                        start: event.date,
                    });
                })
            );
        } catch (error) {
          console.log(error);
        }
    }

    const columns = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'Date', headerName: '法說會日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'Time', headerName: '法說會時間', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'Form', headerName: '法說會形式', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'Message', headerName: '法說會訊息', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'chPDF', headerName: '中文檔案', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'enPDF', headerName: '英文檔案', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'More information', headerName: '相關資訊', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'Video address', headerName: '影音連結資訊', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'Attention', headerName: '其他應敘明事項', flex: 1, headerAlign: 'center', align: 'center' },
        // { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { rootApiIP + "/data/download/single_financialData?filename=" + rowData.value } download = { rowData.value}>Download</a> },
    ];

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
                        events = { (fetchInfo, successCallback, failureCallback) => getCalendarData(fetchInfo, successCallback, failureCallback) }
                        dayMaxEventRows = { 2 }
                        eventClick = { clickEvent }
                        eventMouseEnter = { info => info.el.style.cursor = "pointer" }
                        showNonCurrentDates = { false }
                        fixedWeekCount = { false }
                    />
                </div>
            </div>

            <div className = 'row mt-5 mx-auto' style = {{ width : "90%" }}>
                <DataGrid
                    columns = { columns }
                    rows = { data }
                    page = { page }
                    onPageChange={(newPage) => setPage(newPage)}
                    pageSize = { pageSize }
                    onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                    rowsPerPageOptions = {[5, 10, 20]}
                    getRowId = { row => row.ID }
                    components = {{ Toolbar: GridToolbar }}
                    componentsProps = {{ toolbar: { showQuickFilter: true },}}
                    pagination
                    autoHeight
                    disableColumnMenu
                    disableColumnSelector
                    disableDensitySelector
                    disableColumnFilter
                    disableSelectionOnClick = { true }
                />
            </div>
        </>
    );
}

export default CalendarComp;