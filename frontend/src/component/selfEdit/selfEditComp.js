import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import { columns1_edit } from '../column/column';

function SelfEditComp() {
    var date = new Date();
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setDate(1);
    date.setMonth(date.getMonth() - 3);
    
    const last3Month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')

    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [superUser, setSuperUser] = useState(0)

    useEffect(() => {
        axios.get(rootApiIP + "/data/superUser")
        .then((res) => {
            setSuperUser(res.data[0]["superUser"])

            axios.post(rootApiIP + "/data/financial_search", {
                "stock_num_name" : "",
                "startDate" : last3Month,
                "endDate" : today,
                "investmentCompany" : "",
            }).then(res => {
                setData(res.data)
                setPage(0)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
    
                setData([])
                setPage(0)
            })
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            { superUser === 1 ? 
                <div className = 'row mx-auto'>
                    <DataGrid
                        columns = { columns1_edit }
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
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                        autoHeight
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </div> : <p color = "red">權限不足</p> }
        </>
    );
}

export default SelfEditComp;