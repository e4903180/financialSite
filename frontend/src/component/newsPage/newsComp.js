import { Backdrop, Button, CircularProgress, List, ListItemButton, ListItemText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import { columns_news } from '../column/column';
import { categoryList } from './categoryList';

function NewsComp() {
    var Today = new Date()
    const todayDate = Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0')
    const [startDate, setStartDate] = useState(todayDate)
    const [loading, setLoading] = useState(false)
    const [data0, setData0] = useState([])
    const [page0, setPage0] = useState(0)
    const [pageSize0, setPageSize0] = useState(10)

    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [column, setColumn] = useState("title")
    const [category, setCategory] = useState("全部")
    const [pattern, setPattern] = useState("")

    const columns_summary_news = [
        { field: "category", headerName : "新聞類別", flex: 1, headerAlign: 'center', align: 'center' },
        { field: "todayQuantity", headerName : todayDate + "新聞數量", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
            rowData => <Button variant = "text" onClick = { () => buttonTodayHandle(rowData["row"]["category"]) }>{rowData.value}</Button>
        },
        { field: "pastQuantity", headerName : todayDate + "前新聞數量", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
            rowData => <Button variant = "text" onClick = { () => buttonPastHandle(rowData["row"]["category"]) }>{rowData.value}</Button>
        }
    ];

    const buttonTodayHandle = (buttonCategory) => {
        setLoading(true)

        axios.get(rootApiIP + "/data/news_search_today", { params : {
            "date" : todayDate,
            "category" : buttonCategory
        }})
        .then((res) => {
            console.log(res.data)
            setData(res.data)
            setLoading(false)
            window.scrollTo({
                left : 0, 
                top : document.body.scrollHeight,
                behavior : "smooth"
            })
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
            setLoading(false)
        })
    }

    const buttonPastHandle = (buttonCategory) => {
        setLoading(true)

        axios.get(rootApiIP + "/data/news_search_past", { params : {
            "date" : todayDate,
            "category" : buttonCategory
        }})
        .then((res) => {
            setData(res.data)
            setLoading(false)
            window.scrollTo({
                left : 0, 
                top : document.body.scrollHeight,
                behavior : "smooth"
            })
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
            setLoading(false)
        })
    }

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)

        axios.get(rootApiIP + "/data/news_search", { params :{
            "date" : startDate,
            "column" : column,
            "pattern" : pattern,
            "category" : category
        }})
        .then((res) => {
            setData(res.data)
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
            setLoading(false)
        })
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/news_summary", {params :{
            "date" : startDate,
        }})
        .then((res) => {
            setData0(res.data)
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
            
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">新聞資料庫總覽</h3>

                <div className = 'col-md-10 mx-auto pt-3'>
                    <DataGrid
                        columns = { columns_summary_news }
                        rows = { data0 }
                        page = { page0 }
                        onPageChange={(newPage) => setPage0(newPage)}
                        pageSize = { pageSize0 }
                        onPageSizeChange={ (newPageSize) => setPageSize0(newPageSize) }
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

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">新聞資料庫查詢</h3>

                <form onSubmit = { submit }>
                    <div className = 'form-group row py-3'>
                        <label htmlFor = "columns" className = "col-md-3 col-form-label text-center">搜尋欄位:</label>
                        <div className = 'col-md-3'>
                            <select id = "columns" className = "form-select" onChange = {e => setColumn(e.target.value)}>
                                <option value = "title">新聞標題</option>
                                <option value = "repoter">記者</option>
                            </select>
                        </div>
                        
                        <div className = 'col-md-6'>
                            <input type = "text" className = "form-control" onChange = { e => 
                                setPattern(e.target.value) }></input>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <label htmlFor = "category" className = "col-md-3 col-form-label text-center">新聞類別:</label>
                        <div className = 'col-md-4'>
                            <select id = "category" className = "form-select" onChange = {e => setCategory(e.target.value)}>
                                { 
                                    categoryList.map((ele, idx) => 
                                        <option value = { ele } key = { idx }>{ele}</option>) 
                                }
                            </select>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <label htmlFor = "date" className = "col-md-3 col-form-label text-center">新聞資料起始日:</label>
                        <div className = 'col-md-3'>
                            <input type = "date" id = "date" className = "form-control" onChange = {e => setStartDate(e.target.value)} value = { startDate }></input>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <div className = 'col-md-12 text-center'>
                            <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>搜尋</button>
                        </div>
                    </div>
                </form>
            </div>
            
            <h3 className = "display-6 text-center">查詢結果</h3>
            <hr className = 'mx-auto' style = {{ width : "95vw" }}/>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-10 mx-auto'>
                    <DataGrid
                        columns = { columns_news }
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
            </div>
        </>
    );
}

export default NewsComp;