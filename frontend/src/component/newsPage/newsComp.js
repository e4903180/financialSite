import { Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useState } from 'react';
import { rootApiIP } from '../../constant';
import { columns_news } from '../column/column';

function NewsComp() {
    var Today = new Date()
    let day = (Today.getDate()).toString().padStart(2, "0")
    let month = ( Today.getMonth() + 1).toString().padStart(2, "0")
    let year = Today.getFullYear()

    const [startDate, setStartDate] = useState(`${year}-${month}-${day}`)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [column, setColumn] = useState("title")
    const [category, setCategory] = useState("all")
    const [pattern, setPattern] = useState("")

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
                        <div className = 'col-md-3'>
                            <select id = "category" className = "form-select" onChange = {e => setCategory(e.target.value)}>
                                <option value = "all">全部</option>
                                <option value = "工商時報 證券">工商時報 證券</option>
                                <option value = "工商時報 科技">工商時報 科技</option>
                                <option value = "工商時報 產業">工商時報 產業</option>
                                <option value = "MoneyDj 科技">MoneyDj 科技</option>
                                <option value = "MoneyDj 產業">MoneyDj 產業</option>
                                <option value = "經濟日報 產業 產業熱點">經濟日報 產業 產業熱點</option>
                                <option value = "經濟日報 產業 科技產業">經濟日報 產業 科技產業</option>
                                <option value = "經濟日報 產業 綜合產業">經濟日報 產業 綜合產業</option>
                                <option value = "經濟日報 產業 產業達人">經濟日報 產業 產業達人</option>
                                <option value = "經濟日報 證券 市場焦點">經濟日報 證券 市場焦點</option>
                                <option value = "經濟日報 證券 集中市場">經濟日報 證券 集中市場</option>
                                <option value = "經濟日報 證券 櫃買動態">經濟日報 證券 櫃買動態</option>
                                <option value = "經濟日報 證券 證券達人">經濟日報 證券 證券達人</option>
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