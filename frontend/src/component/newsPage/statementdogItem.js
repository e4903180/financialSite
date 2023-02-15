import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useState } from 'react';
import { config } from '../../constant';
import { columns_statementdog } from '../column/column';

function StatementdogItem(props) {
    var Today = new Date()
    const todayDate = Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0')

    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pattern, setPattern] = useState("")
    const [startDate, setStartDate] = useState(todayDate)
    const [endDate, setEndDate] = useState(todayDate)

    const submit = (e) => {
        e.preventDefault()
        props.setLoading(true)

        axios.get(config["rootApiIP"] + "/data/news_statmentdog_search", { params :{
            "startDate" : startDate,
            "endDate" : endDate,
            "pattern" : pattern,
        }})
        .then((res) => {
            props.setData(res.data)
            props.setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
            props.setLoading(false)
        })
    }

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <form onSubmit = { submit }>
                    <div className = 'form-group row py-3'>
                        <label htmlFor = "pattern" className = "col-md-3 col-form-label text-center">新聞標題:</label>
                        <div className = 'col-md-6'>
                            <input id = "pattern" type = "text" className = "form-control" onChange = { e => 
                                setPattern(e.target.value) }></input>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <label htmlFor = "startDate" className = "col-md-3 col-form-label text-center">日期:</label>
                        <div className = 'col-md-3'>
                            <input type = "date" id = "startDate" className = "form-control" onChange = {e => setStartDate(e.target.value)} value = { startDate }></input>
                        </div>

                        <label htmlFor = "endDate" className = "col-md-3 col-form-label text-center">到</label>
                        <div className = 'col-md-3'>
                            <input type = "date" id = "endDate" className = "form-control" onChange = {e => setEndDate(e.target.value)} value = { endDate }></input>
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
            <hr className = 'mx-auto'/>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-10 mx-auto'>
                    <DataGrid
                        columns = { columns_statementdog }
                        rows = { props.data }
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

export default StatementdogItem;