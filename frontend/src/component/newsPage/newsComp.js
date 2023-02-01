import { Backdrop, CircularProgress, List, ListItemButton, ListItemText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import { columns_news } from '../column/column';
import { categoryList } from './categoryList';

function NewsComp() {
    const [startDate, setStartDate] = useState("2023-01-01")
    const [loading, setLoading] = useState(false)
    const [data0, setData0] = useState([])

    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [column, setColumn] = useState("title")
    const [category, setCategory] = useState("全部")
    const [pattern, setPattern] = useState("")

    const listButtonHandle = (listCategory) => {
        setCategory(listCategory)
        setLoading(true)

        axios.post(rootApiIP + "/data/news_search", {
            "date" : startDate,
            "column" : column,
            "pattern" : pattern,
            "category" : listCategory
        })
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

    const dateHandle = (date) => {
        setStartDate(date)

        axios.get(rootApiIP + "/data/news_summary", {params :{
            "date" : date,
        }})
        .then((res) => {
            setData0(res.data)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)

        axios.post(rootApiIP + "/data/news_search", {
            "date" : startDate,
            "column" : column,
            "pattern" : pattern,
            "category" : category
        })
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

                <div className = 'form-group row py-3'>
                    <label htmlFor = "date" className = "col-md-3 col-form-label text-center">新聞資料起始日:</label>
                    <div className = 'col-md-3'>
                        <input type = "date" id = "date" className = "form-control" onChange = {e => { dateHandle(e.target.value) }} value = { startDate }></input>
                    </div>
                </div>

                <div className = 'col-md-10 mx-auto'>
                    <div className = 'card'>
                        <div className = 'card-body'>
                            <div className = 'row mx-auto'>
                                <div className = 'col-md-6'>
                                    <List>
                                        { data0.slice(0, 7).map((ele, idx) => {
                                            return (
                                                <ListItemButton key = { idx } onClick = { () => listButtonHandle(ele["category"]) }>
                                                    <ListItemText primary = { ele["category"] + ": " + ele["quantity"] } />
                                                </ListItemButton>
                                            )
                                        }) }
                                    </List>
                                </div>
                                <div className = 'col-md-6'>
                                    <List>
                                        { data0.slice(7, 14).map((ele, idx) => {
                                                return (
                                                    <ListItemButton key = { idx } onClick = { () => listButtonHandle(ele["category"]) }>
                                                        <ListItemText primary = { ele["category"] + ": " + ele["quantity"] } />
                                                    </ListItemButton>
                                                )
                                        }) }
                                    </List>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <input type = "date" id = "date" className = "form-control" onChange = {e => dateHandle(e.target.value)} value = { startDate }></input>
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