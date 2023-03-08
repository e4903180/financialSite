import { Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import { columns_financialDataIndustry } from '../column/column';

function FinancialDataIndustryComp() {
    var date = new Date();
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setDate(1);
    date.setMonth(date.getMonth() - 3);
    
    const last3Month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
   
    const [startDate, setStartDate] = useState(last3Month)
    const [endDate, setEndDate] = useState(today)
    const [column, setColumn] = useState("title")
    const [investmentCompany, setInvestmentCompany] = useState("")
    const [pattern, setPattern] = useState("")
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(true)

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)

        axios.get(config["rootApiIP"] + "/data/industry_search", { params : {
            "startDate" : startDate,
            "endDate" : endDate,
            "column" : column,
            "pattern" : pattern,
            "investmentCompany" : investmentCompany
        } })
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
        axios.get(config["rootApiIP"] + "/data/industry_search", { params : {
            "startDate" : last3Month,
            "endDate" : today,
            "pattern" : pattern,
            "investmentCompany" : investmentCompany
        } })
        .then((res) => {
            setData(res.data)
            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
            setLoading(false)
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
                <h3 className = "display-6 text-center">產業研究報告</h3>

                <form onSubmit = { submit }>
                    <div className = 'form-group row py-3'>
                        <label htmlFor = "columns" className = "col-md-3 col-form-label text-center">搜尋欄位:</label>
                        <div className = 'col-md-3'>
                            <select id = "columns" className = "form-select" onChange = {e => setColumn(e.target.value)}>
                                <option value = "title">標題</option>
                                <option value = "category">產業類別</option>
                            </select>
                        </div>
                        
                        <div className = 'col-md-6'>
                            <input type = "text" className = "form-control" onChange = { e => 
                                setPattern(e.target.value) }></input>
                        </div>
                    </div>
                    
                    <div className = 'form-group row py-3'>
                        <label htmlFor = "startDate" className = "col-md-3 col-form-label text-center">日期:</label>
                        <div className = 'col-md-3'>
                            <input type = "date" id = "startDate" className = "form-control" onChange = {e => setStartDate(e.target.value)} value = { last3Month }></input>
                        </div>

                        <label htmlFor = "endDate" className = "col-md-3 col-form-label text-center">到</label>
                        <div className = 'col-md-3'>
                            <input type = "date" id = "endDate" className = "form-control" onChange = {e => setEndDate(e.target.value)} value = { today }></input>
                        </div>
                    </div>

                    <div className = 'form-group row'>
                        <label htmlFor = "provider" className = "col-md-3 col-form-label text-center">券商名稱:</label>
                        <div className = 'col-md-3'>
                            <select id = "provider" className = "form-select" onChange = {e => setInvestmentCompany(e.target.value)}>
                                <option value = "">全部</option>
                                <option value = "台新投顧">台新投顧</option>
                                <option value = "中信投顧">中信投顧</option>
                                <option value = "元富">元富</option>
                                <option value = "國票">國票</option>
                                <option value = "元大">元大</option>
                                <option value = "統一投顧">統一投顧</option>
                                <option value = "第一金">第一金</option>
                                <option value = "富邦台灣">富邦台灣</option>
                                <option value = "SinoPac">永豐金證券</option>
                                <option value = "CTBC">CTBC</option>
                                <option value = "永豐投顧">永豐投顧</option>
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

            <h3 className = "display-6 text-center">查詢結果</h3>
            <hr className = 'mx-auto' style = {{ width : "85vw" }}/>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-10 mx-auto'>
                    <DataGrid
                        columns = { columns_financialDataIndustry }
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

export default FinancialDataIndustryComp;