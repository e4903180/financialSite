import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { config } from '../../../constant';
import { columns_twse } from '../../column/column';
import { Backdrop, CircularProgress } from '@mui/material';
import { AutoCom } from '../../../autoCom';
import TickerSearchComp from '../../tickerSearchComp';

function CalenderComp() {
    var date = new Date();
    
    const thisMonth = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setMonth(date.getMonth() + 2);
    date.setDate(0);
    const nextMoth = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    const autocom = AutoCom.AutoComList;

    const [ticker, setTicker] = useState("")
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState(thisMonth)
    const [endDate, setEndDate] = useState(nextMoth)
    const [tickerError, setTickerError] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const submit = (e) => {
        e.preventDefault()
        setTickerError(false)
        setLoading(true)
        setPage(0)

        if((ticker !== "") && (!autocom.map(element => element.stock_num_name).includes(ticker))){
            setTickerError(true)
            setLoading(false)
        }else{
            axios.get(config["rootApiIP"] + "/data/calender_search", {params : {
                "stock_num_name" : ticker,
                "startDate" : startDate,
                "endDate" : endDate,
            }}).then(res => {
                setData(res.data)
                setLoading(false)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()

                setData([])
                setPage(0)
            })
        }
    }

    useEffect(() => {
        setLoading(true)

        axios.get(config["rootApiIP"] + "/data/calender_search", { params : {
            "stock_num_name" : ticker,
            "startDate" : thisMonth,
            "endDate" : nextMoth,
        }})
        .then(res => {
            setData(res.data)
            setLoading(false)
        }).catch(res => {
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

            <div className = 'row py-3 mx-auto'>
                <h3 className = "text-center">法說會資料庫查詢</h3>

                <div className = 'col-md-8 mx-auto'>
                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "ticker" className = "col-md-3 col-form-label text-center">股票代號&名稱:</label>
                            
                            <div className = 'col-md-4'>
                                <TickerSearchComp init = "" setTicker = {setTicker}/>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "startDate" className = "col-md-3 col-form-label text-center">開始日期:</label>
                            
                            <div className = 'col-md-3'>
                                <input type = "date" id = "startDate" className = "form-control" 
                                    onChange = {e => setStartDate(e.target.value)} value = { startDate }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "endDate" className = "col-md-3 col-form-label text-center">結束日期:</label>
                            
                            <div className = 'col-md-3'>
                                <input type = "date" id = "endDate" className = "form-control"
                                    onChange = {e => setEndDate(e.target.value)} value = { endDate }></input>
                            </div>
                        </div>

                        <div className = 'form-group py-3 text-center'>
                            { tickerError ? <p style = {{ color : "red" }}>格式錯誤(必須符合自動完成格式 股票代號 名稱)</p> : <></> }
                            <button id = 'submit' type = "submit" className = "btn btn-primary" 
                                style = {{ width : "200px" }}>搜尋</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className = 'row mx-auto py-3'>
                <h3 className = "text-center">查詢結果</h3>
                
                <div className = 'col-md-10 mx-auto'>
                    <hr className = 'mx-auto'/>

                    <DataGrid
                        style = {{ height : "600px" }}
                        columns = { columns_twse }
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
                    />
                </div>
            </div>
        </>
    );
}

export default CalenderComp;