import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import { columns_popular_news } from '../column/column';
import HighchartBarComp from '../highchart/highchartBarComp';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function TopNewsComp() {
    const [loading, setLoading] = useState(true)
    const [interval, setInterval] = useState("3days")
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const [options, setOptions] = useState({
        chart: {
            type : 'bar',
            height : 500
        },
        title: {
            text: `熱門個股新聞Top10`
        },
        accessibility: {
            enabled: false
        },
        yAxis: {
            title: {
                text: '投資建議分佈'
            }
        }
    })

    const submit = (e) => {
        e.preventDefault()

    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/popular_news", {
            params : {
                "interval" : "3days"
            }
        })
        .then((res) => {
            setData(res.data)
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
                    <h3 className = "display-6 text-center">熱門個股新聞</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "interval" className = "col-md-3 col-form-label text-center">時間區間:</label>
                            <div className = 'col-md-3'>
                                <select id = "interval" className = "form-select" onChange = {e => { setInterval(e.target.value)}}>
                                    <option value = "3days">3天</option>
                                    <option value = "week">一週</option>
                                    <option value = "month">一個月</option>
                                </select>
                            </div>

                            <div className = 'col-md-4 text-center'>
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
                <h3 className = "text-center">熱門個股新聞數據</h3>
                
                <div className = 'col-md-10 mx-auto'>
                    <hr className = 'mx-auto'/>

                    <DataGrid
                        columns = { columns_popular_news }
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

export default TopNewsComp;