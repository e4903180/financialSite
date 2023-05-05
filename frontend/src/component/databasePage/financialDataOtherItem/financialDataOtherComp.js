import { Backdrop, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../../constant';
import { columns_financialDataOther } from '../../column/column';

function FinancialDataOtherComp() {
    var date = new Date();
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setDate(1);
    date.setMonth(date.getMonth() - 3);
    
    const last3Month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
   
    const [startDate, setStartDate] = useState(last3Month)
    const [endDate, setEndDate] = useState(today)
    const [investmentCompany, setInvestmentCompany] = useState("all")
    const [pattern, setPattern] = useState("")
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(true)

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)

        axios.get(config["rootApiIP"] + "/data/other_search", { params : {
            "startDate" : startDate,
            "endDate" : endDate,
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
        axios.get(config["rootApiIP"] + "/data/other_search", { params : {
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

            <div className = 'row mx-auto py-3'>
                <h3 className = "text-center">其他研究報告</h3>

                <div className = 'col-md-8 mx-auto'>
                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "pattern" className = "col-md-3 col-form-label text-center">標題:</label>

                            <div className = 'col-md-6'>
                                <input type = "text" id = "pattern" className = "form-control" onChange = { e => 
                                    setPattern(e.target.value) }></input>
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

                        <div className = 'form-group row'>
                            <label htmlFor = "provider" className = "col-md-3 col-form-label text-center">券商名稱:</label>
                            <div className = 'col-md-3'>
                                <select id = "provider" className = "form-select" onChange = {e => setInvestmentCompany(e.target.value)}>
                                    <option value = "all">全部</option>
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
            </div>

            <div className = 'row mx-auto py-3'>
                <h3 className = "text-center">查詢結果</h3>

                <div className = 'col-md-10 mx-auto'>
                    <hr className = 'mx-auto'/>

                    <DataGrid
                        columns = { columns_financialDataOther }
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

export default FinancialDataOtherComp;