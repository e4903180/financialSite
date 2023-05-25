import { Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import { columns_financialData, columns_twse_recommend } from '../column/column';

function TwseRecommendComp() {
    const [timeInterval, setTimeInterval] = useState("week")
    const [loading, setLoading] = useState(true)
    const [recommend, setRecommend] = useState("buy")
    const [category, setCategory] = useState("all")
    const [categoryList, setCategoryList] = useState([])
    const [type, setType] = useState("all")
    const [twseData, setTwseData] = useState([])
    const [financialData, setFinancialData] = useState([])
    const [pageTwse, setPageTwse] = useState(0)
    const [pageSizeTwse, setPageSizeTwse] = useState(10)
    const [pageFinancialData, setPageFinancialData] = useState(0)
    const [pageSizeFinancialData, setPageSizeFinancialData] = useState(10)

    const typeChangeHandler = (value) => {
        setType(value)
        setCategory("all")

        axios.get(config["rootApiIP"] + "/data/ticker_category", {
            params : {
                "type" : value
            }
        })
        .then((res) => {
            setCategoryList([])
            setCategoryList(res.data)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    const submit = (e) => {
        e.preventDefault()
        setPageTwse(0)
        setPageFinancialData(0)
        setLoading(true)

        axios.get(config["rootApiIP"] + "/data/twse_recommend_search", {
            params : {
                "timeInterval" : timeInterval,
                "category" : category,
                "type" : type,
                "recommend" : recommend
            }
        })
        .then((res) => {
            setTwseData(res.data[0])
            setFinancialData(res.data[1])
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/ticker_category", {
            params : {
                "type" : "all"
            }
        })
        .then((res) => {
            setCategoryList(res.data)

            axios.get(config["rootApiIP"] + "/data/twse_recommend_search", {
                params : {
                    "timeInterval" : timeInterval,
                    "category" : category,
                    "type" : type,
                    "recommend" : recommend
                }
            })
            .then((res) => {
                setTwseData(res.data[0])
                setFinancialData(res.data[1])
                setLoading(false)
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()
            })
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

            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <h3 className = "display-6 text-center">法說會與投資建議</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "timeInterval" className = "col-md-3 col-form-label text-center">個股研究報告時間區間:</label>
                            <div className = 'col-md-3'>
                                <select id = "timeInterval" className = "form-select" onChange = {e => setTimeInterval(e.target.value)}>
                                    <option value = "week">一週前</option>
                                    <option value = "month">一個月前</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "recommend" className = "col-md-3 col-form-label text-center">投資建議:</label>
                            <div className = 'col-md-3'>
                                <select id = "recommend" className = "form-select" onChange = {e => setRecommend(e.target.value)}>
                                    <option value = "buy">買進</option>
                                    <option value = "neutral">持有</option>
                                    <option value = "sell">賣出</option>
                                    <option value = "interval">區間操作</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "type" className = "col-md-3 col-form-label text-center">上市櫃:</label>
                            <div className = 'col-md-3'>
                                <select id = "type" className = "form-select" onChange = {e => typeChangeHandler(e.target.value)}>
                                    <option value = "all">全部</option>
                                    <option value = "上市">上市</option>
                                    <option value = "上櫃">上櫃</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "category" className = "col-md-3 col-form-label text-center">產業類別:</label>
                            <div className = 'col-md-3'>
                                <select id = "category" className = "form-select" onChange = {e => setCategory(e.target.value)}>
                                    <option value = "all">全部</option>
                                    {
                                        categoryList.map(function(ele, idx){
                                            return <option key = {idx} value = {ele["class"]}>{ele["class"]}</option>
                                        })
                                    }
                                </select>
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

                <div className = 'col-md-6 mx-auto h-100'>
                    <h4 className = "text-center">法說會</h4>

                    <DataGrid
                        columns = { columns_twse_recommend }
                        rows = { twseData }
                        page = { pageTwse }
                        onPageChange = {(newPage) => setPageTwse(newPage)}
                        pageSize = { pageSizeTwse }
                        onPageSizeChange = { (newPageSize) => setPageSizeTwse(newPageSize) }
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

                <div className = 'col-md-6 mx-auto h-100'>
                    <h4 className = "text-center">個股研究報告</h4>

                    <DataGrid
                        columns = { columns_financialData }
                        rows = { financialData }
                        page = { pageFinancialData }
                        onPageChange = {(newPage) => setPageFinancialData(newPage)}
                        pageSize = { pageSizeFinancialData }
                        onPageSizeChange = { (newPageSize) => setPageSizeFinancialData(newPageSize) }
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

export default TwseRecommendComp;