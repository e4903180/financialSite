import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function subListComp() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);

    const column_sub_list = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'endTime', headerName: '訂閱結束日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: "subTime", headerName : "訂閱起始日期", flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'ticker', headerName: '股票', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'subType', headerName: '通知方式', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'content', headerName: '心法', flex: 1, headerAlign: 'center', sortable: false, align: 'center' },
        { field: 'action', headerName: '取消訂閱', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <DeleteOutlineIcon style = {{ cursor : "pointer" }} onClick = {() => handle_sub_list_cancel(rowData)}/>},
    ]

    function handle_sub_list_cancel(rowData){
        console.log(rowData)

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
        axios.get(rootApiIP + "/data/get_support_resistance_sub")
        .then(res => {
            setRows(res.data)
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">訂閱清單</h3>
            </div>

            <div className = 'row' style = {{ height : "50vh" }}>
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

export default subListComp;