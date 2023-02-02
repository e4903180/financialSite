import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SupportResisCard from './support_resistance_card';
import PricingStratagyCard from './pricing_stratagy_card';
import PerRiverCard from './PER_river_card';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function SubListComp() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);
    const [type, setType] = useState("type1");
    const [lineSub, setLineSub] = useState(false)
    const [emailSub, setEmailSub] = useState(false)

    const handleLineChange = (event) => {
        setLineSub(event.target.checked)

        axios.put(rootApiIP + "/data/update_user_lineNotify_type", {
            "switch" : event.target.checked
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    const handleEmailChange = (event) => {
        setEmailSub(event.target.checked)

        axios.put(rootApiIP + "/data/update_user_emailNotify_type", {
            "switch" : event.target.checked
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    //需要用到row做filter不能獨立到column.js
    const column_sub_list = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'endTime', headerName: '訂閱結束日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: "subTime", headerName : "訂閱起始日期", flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'strategy', headerName: '策略類型', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'content', headerName: '策略內容', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
        { field: 'alertCondition', headerName: '警示條件', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
        { field: 'action', headerName: '取消訂閱', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : 
        rowData => <DeleteOutlineIcon style = {{ cursor : "pointer" }} onClick = {() => handle_sub_list_cancel(rowData)}/>},
    ]
    
    function handle_sub_list_cancel(rowData){
        axios.delete(rootApiIP + "/data/cancel_sub", {
            data : {
                subTime : rowData.row.subTime
            }
        })
        .then(res => {
            setRows(rows.filter((data) => data.ID !== rowData.row.ID));
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/get_sub")
        .then(res => {
            setRows(res.data)
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(rootApiIP + "/data/get_user_notify_type")
        .then(res => {
            setLineSub(Boolean(res.data[0]["lineNotify"]))
            setEmailSub(Boolean(res.data[0]["emailNotify"]))
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">訂閱策略警示</h3>
            </div>

            <div className = 'row mx-auto py-3 justify-content-center'>
                <div className = 'col-md-6'>
                    <div className = "card h-100 p-0 mt-3">
                        <div className = 'mx-3 mt-2'>
                            <ul className = "nav nav-tabs">
                                <li className = "nav-item">
                                    <button className = "nav-link active" data-bs-toggle = "tab" onClick = {() => setType("type1")}>股票定價策略</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("type2")}>本益比河流圖</button>
                                </li>

                                <li className = "nav-item">
                                    <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("type3")}>天花板地板線</button>
                                </li>
                            </ul>

                            { type === "type1" && <PricingStratagyCard setRows = { setRows }/>}
                            { type === "type2" && <PerRiverCard setRows = { setRows }/>}
                            { type === "type3" && <SupportResisCard setRows = { setRows }/>}
                        </div>
                    </div>
                </div>

                <div className = 'col-md-2'>
                    <div className = "card p-0 mt-3">
                        <div className = "card-header">
                            通知方式
                        </div>

                        <div className = "card-body">
                            <FormGroup>
                                <FormControlLabel control = {<Switch checked = { lineSub } onChange = {handleLineChange} />} label = "Line" />
                                <FormControlLabel control = {<Switch checked = { emailSub } onChange = {handleEmailChange} />} label = "Email" />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">訂閱清單</h3>
            </div>

            <div className = 'row mx-auto' style = {{ height : "60vh" }}>
                <div className = 'col-md-8 mx-auto'>
                    <DataGrid
                        columns = { column_sub_list }
                        rows = { rows }
                        page = { page }
                        onPageChange = {(newPage) => setPage(newPage)}
                        pageSize = { pageSize }
                        onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
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

export default SubListComp;