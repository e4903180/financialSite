import { Backdrop, Button, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NewsItem from './newsItem';
import { config } from '../../../constant';

function NewsComp() {
    var Today = new Date()
    const todayDate = Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0')

    const [loading, setLoading] = useState(false)
    const [data0, setData0] = useState([])
    const [page0, setPage0] = useState(0)
    const [pageSize0, setPageSize0] = useState(10)
    const [startDate, setStartDate] = useState("")
    const [category, setCategory] = useState("all")

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

        if (date === "today"){
            setStartDate(todayDate)
        }else if (date === "past"){
            setStartDate("2023-01-01")
        }

        if(buttonCategory === "全部") setCategory("all")
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
            
            <div className = 'row pt-3 mx-auto'>
                <div className = 'col-md-8 mx-auto'>
                    <h3 className = "text-center">新聞資料庫總覽</h3>
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

            <div className = 'row mx-auto pt-3'>
                <div className = 'col-md-10 mx-auto'>
                    <h3 className = "text-center">新聞資料庫查詢</h3>

                    <NewsItem 
                        setLoading = { setLoading } 
                        data = { dataNews } 
                        setData = { setDataNews } 
                        startDate = { startDate } 
                        endDate = { todayDate }
                        category = { category }
                    />
                </div>
            </div>
        </>
    );
}

export default NewsComp;