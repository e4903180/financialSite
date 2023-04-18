import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../constant';
import HighchartBarComp from '../highchart/highchartBarComp';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { columns_financialData } from '../column/column';

function TopTickerComp() {
    var Today = new Date()
    const todayDate = Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0')

    const [startDate, setStartDate] = useState("2023-01-01")
    const [endDate, setEndDate] = useState(todayDate)
    const [top, setTop] = useState(5)
    const [recommend, setRecommend] = useState("all")
    const [category, setCategory] = useState("all")
    const [categoryList, setCategoryList] = useState([])
    const [type, setType] = useState("all")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            height : 500
        },
        title: {
            text: `熱門研究報告Top${top}`
        },
        accessibility: {
            enabled: false
        },
        yAxis: {
            title: {
                text: '投資建議分佈'
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
            },
        }
    })

    const submit = (e) => {
        e.preventDefault()
        setPage(0)
        setLoading(true)

        axios.get(config["rootApiIP"] + "/data/top_ticker", {
            params : {
                "start_date" : startDate,
                "end_date" : endDate,
                "top" : top,
                "recommend" : recommend,
                "category" : category,
                "type" : type
            }
        })
        .then((res) => {
            let categories = []
            let series = {
                "buy" : [],
                "sell" : [],
                "hold" : [],
                "interval" : []
            }

            res.data["recommend_result"].map((ele, idx) => {
                categories.push(ele["stock_name"])
                series["buy"].push(ele["recommend_distribution"]["buy"])
                series["sell"].push(ele["recommend_distribution"]["sell"])
                series["hold"].push(ele["recommend_distribution"]["hold"])
                series["interval"].push(ele["recommend_distribution"]["interval"])
            })

            setOptions({
                xAxis: {
                    categories : categories
                },
                series : [
                    {
                        name : "區間操作",
                        data : series["interval"]
                    },
                    {
                        name : "賣出",
                        data : series["sell"]
                    },
                    {
                        name : "持有",
                        data : series["hold"]
                    },
                    {
                        name : "買進",
                        data : series["buy"]
                    },
                ]
            })

            setData(res.data["row_data"])
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

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

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/ticker_category", {
            params : {
                "type" : "all"
            }
        })
        .then((res) => {
            setCategoryList(res.data)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(config["rootApiIP"] + "/data/top_ticker", {
            params : {
                "start_date" : startDate,
                "end_date" : endDate,
                "top" : top,
                "recommend" : recommend,
                "category" : category,
                "type" : type
            }
        })
        .then((res) => {
            let categories = []
            let series = {
                "buy" : [],
                "sell" : [],
                "hold" : [],
                "interval" : []
            }

            res.data["recommend_result"].map((ele, idx) => {
                categories.push(ele["stock_name"])
                series["buy"].push(ele["recommend_distribution"]["buy"])
                series["sell"].push(ele["recommend_distribution"]["sell"])
                series["hold"].push(ele["recommend_distribution"]["hold"])
                series["interval"].push(ele["recommend_distribution"]["interval"])
            })

            setOptions({
                xAxis: {
                    categories : categories
                },
                series : [
                    {
                        name : "區間操作",
                        data : series["interval"]
                    },
                    {
                        name : "賣出",
                        data : series["sell"]
                    },
                    {
                        name : "持有",
                        data : series["hold"]
                    },
                    {
                        name : "買進",
                        data : series["buy"]
                    },
                ]
            })

            setData(res.data["row_data"])
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

            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <h3 className = "display-6 text-center">熱門個股研究報告</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "startDate" className = "col-md-3 col-form-label text-center">開始日期:</label>
                            <div className = 'col-md-3'>
                                <input type = "date" id = "startDate" className = "form-control" 
                                    onChange = {e => setStartDate(e.target.value)} value = { "2023-01-01" }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "endDate" className = "col-md-3 col-form-label text-center">結束日期:</label>
                            <div className = 'col-md-3'>
                                <input type = "date" id = "endDate" className = "form-control" 
                                    onChange = {e => setEndDate(e.target.value)} value = { endDate }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "top" className = "col-md-3 col-form-label text-center">熱門股票筆數:</label>
                            <div className = 'col-md-3'>
                                <select id = "top" className = "form-select" onChange = {e => {
                                    setTop(e.target.value)
                                    setOptions({
                                        title: {
                                            text: `熱門研究報告Top${e.target.value}`
                                        },
                                    })
                                }}>
                                    <option value = "5">5</option>
                                    <option value = "10">10</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "recommend" className = "col-md-3 col-form-label text-center">投資建議:</label>
                            <div className = 'col-md-3'>
                                <select id = "recommend" className = "form-select" onChange = {e => setRecommend(e.target.value)}>
                                    <option value = "all">全部</option>
                                    <option value = "buy">買進</option>
                                    <option value = "hold">持有</option>
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

            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <HighchartBarComp options = { options }/>
                </div>
            </div>

            <div className = 'row mx-auto py-3'>
                <h3 className = "text-center">個股研究報告投資建議分佈數據</h3>
                
                <div className = 'col-md-10 mx-auto'>
                    <hr className = 'mx-auto'/>

                    <DataGrid
                        columns = { columns_financialData }
                        rows = { data }
                        page = { page }
                        onPageChange = {(newPage) => setPage(newPage)}
                        pageSize = { pageSize }
                        onPageSizeChange = { (newPageSize) => setPageSize(newPageSize) }
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
                        autoHeight
                    />
                </div>
            </div>
        </>
    );
}

export default TopTickerComp;