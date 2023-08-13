import { Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import { columns_twse_recommend } from '../column/column';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function TwseRecommendComp() {
    var Today = new Date()
    const todayDate = Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0')
    const startDate = todayDate.slice(0, -2) + "01"

    const [startDateTwse, setStartDateTwse] = useState(startDate)
    const [endDateTwse, setEndDateTwse] = useState(todayDate)

    const [startDateResearch, setStartDateResearch] = useState(startDate)
    const [endDateResearch, setEndDateResearch] = useState(todayDate)

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [pageTwse, setPageTwse] = useState(0)
    const [pageSizeTwse, setPageSizeTwse] = useState(10)

    const [detailClick, setDetailClick] = useState(false)
    const [pageDetail, setPageDetail] = useState(0)
    const [pageSizeDetail, setPageSizeDetail] = useState(10)
    const [detailColumns, setDetailColumns] = useState([])
    const [detailData, setDetailData] = useState([])

    const submit = (e) => {
        e.preventDefault()
        setPageTwse(0)

        setLoading(true)

        axios.get(config["rootApiIP"] + "/data/twse_financialData", {
            params : {
                "startDateTwse" : startDateTwse,
                "endDateTwse" : endDateTwse,
                "startDateResearch" : startDateResearch,
                "endDateResearch" : endDateResearch
            }
        })
        .then((res) => {
            setData(res.data)
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/twse_financialData", {
            params : {
                "startDateTwse" : startDateTwse,
                "endDateTwse" : endDateTwse,
                "startDateResearch" : startDateResearch,
                "endDateResearch" : endDateResearch
            }
        })
        .then((res) => {
            setData(res.data)
            console.log(res.data)
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <Backdrop
                sx = {{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { loading }
            >
                資料載入中&emsp;
                <CircularProgress color = "inherit" />
            </Backdrop>

            <Backdrop
                sx = {{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { detailClick }
            >
                <div className = 'row mx-auto py-2' style = {{backgroundColor : "white", width : "90vw"}}>
                    <div className = 'col-md-1 offset-11 py-1 text-center'>
                        <HighlightOffIcon onClick = {() => setDetailClick(false)} style = {{ cursor : "pointer"}}/>
                    </div>

                    <div>
                        <DataGrid
                            columns = { detailColumns }
                            rows = { detailData }
                            page = { pageDetail }
                            onPageChange = {(newPage) => setPageDetail(newPage)}
                            pageSize = { pageSizeDetail }
                            onPageSizeChange = { (newPageSize) => setPageSizeDetail(newPageSize) }
                            rowsPerPageOptions = {[10]}
                            getRowId = { row => row.ID }
                            components = {{ Toolbar: GridToolbar }}
                            componentsProps = {{ toolbar: { showQuickFilter: true },}}
                            pagination
                            disableColumnMenu
                            disableColumnSelector
                            disableDensitySelector
                            disableColumnFilter
                            disableSelectionOnClick = { true }
                            autoHeight
                        />
                    </div>
                </div>
            </Backdrop>

            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <h3 className = "display-6 text-center">法說會與個股研究報告</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "startDate" className = "col-md-3 col-form-label text-center">法說會開始日期:</label>
                            <div className = 'col-md-3'>
                                <input type = "date" id = "startDateTwse" className = "form-control" 
                                    onChange = {e => setStartDateTwse(e.target.value)} value = { startDateTwse }></input>
                            </div>

                            <label htmlFor = "endDate" className = "col-md-3 col-form-label text-center">法說會結束日期:</label>
                            <div className = 'col-md-3'>
                                <input type = "date" id = "endDateTwse" className = "form-control" 
                                    onChange = {e => setEndDateTwse(e.target.value)} value = { endDateTwse }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "startDate" className = "col-md-3 col-form-label text-center">個股研究報告開始日期:</label>
                            <div className = 'col-md-3'>
                                <input type = "date" id = "startDateResearch" className = "form-control" 
                                    onChange = {e => setStartDateResearch(e.target.value)} value = { startDateResearch }></input>
                            </div>

                            <label htmlFor = "endDate" className = "col-md-3 col-form-label text-center">個股研究報告結束日期:</label>
                            <div className = 'col-md-3'>
                                <input type = "date" id = "endDateResearch" className = "form-control" 
                                    onChange = {e => setEndDateResearch(e.target.value)} value = { endDateResearch }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <div className = 'col-md-12 text-center'>
                                <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>搜尋</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className = 'row mx-auto py-3 px-5' style = {{ height : "70vh" }}>
                <h3 className = "text-center">查詢結果</h3>
                <hr className = 'mx-auto'/>

                <div className = 'col-md-8 mx-auto h-100'>
                    <DataGrid
                        columns = { columns_twse_recommend(setDetailClick, setDetailColumns, setPageDetail, setDetailData) }
                        rows = { data }
                        page = { pageTwse }
                        onPageChange = {(newPage) => setPageTwse(newPage)}
                        pageSize = { pageSizeTwse }
                        onPageSizeChange = { (newPageSize) => setPageSizeTwse(newPageSize) }
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
            </div>
        </>
    );
}

export default TwseRecommendComp;