import { Backdrop, Button, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import NewsItem from './newsItem';

function NewsComp() {
    var Today = new Date()
    const todayDate = Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0')

    const [type, setType] = useState("news")
    const [loading, setLoading] = useState(false)
    const [data0, setData0] = useState([])
    const [page0, setPage0] = useState(0)
    const [pageSize0, setPageSize0] = useState(10)
    const [startDate, setStartDate] = useState("")
    const [category, setCategory] = useState("全部")

    const [dataNews, setDataNews] = useState([])

    const columns_summary_news = [
        { field: "category", headerName : "新聞類別", flex: 1, headerAlign: 'center', align: 'center' },
        { field: "todayQuantity", headerName : todayDate + "新聞數量", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
            rowData => <Button variant = "text" onClick = { () => buttonNewsHandle("today", rowData["row"]["category"]) }>{rowData.value}</Button>
        },
        { field: "pastQuantity", headerName : todayDate + "前新聞數量", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
            rowData => <Button variant = "text" onClick = { () => buttonNewsHandle("past", rowData["row"]["category"]) }>{rowData.value}</Button>
        }
    ];

    const buttonNewsHandle = (date, buttonCategory) => {
        setLoading(true)
        setType("news")

        if (date === "today"){
            setStartDate(todayDate)
        }else if (date === "past"){
            setStartDate("2023-01-01")
        }

        setCategory(buttonCategory)

        axios.get(config["rootApiIP"] + `/data/news_search_${date}`, { params : {
            "date" : todayDate,
            "category" : buttonCategory
        }})
        .then((res) => {
            setDataNews(res.data)
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

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/news_summary", {params :{
            "date" : todayDate,
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
            
            <div className = 'row mx-auto py-3' style = {{ width : "90vw" }}>
                <h3 className = "display-6 text-center">新聞資料庫總覽</h3>

                <div className = 'col-md-8 mx-auto'>
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

            <h3 className = "display-6 text-center py-3">新聞資料庫查詢</h3>
            
            <div className = 'row mx-auto'>
                <div className = 'col-md-11 mx-auto'>
                    <div className = "card h-100 p-0 mt-3">
                        <div className = 'mx-3 mt-2'>
                            <ul className = "nav nav-tabs">
                                <li className = "nav-item">
                                    <button className = {`nav-link ${ type === "news" ? "active" : ""}`} data-bs-toggle = "tab" onClick = {() => setType("news")}>新聞</button>
                                </li>
                            </ul>

                            { type === "news" && <NewsItem 
                                    setLoading = { setLoading } 
                                    data = { dataNews } 
                                    setData = { setDataNews } 
                                    startDate = { startDate } 
                                    endDate = { todayDate }
                                    category = { category }
                                />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewsComp;