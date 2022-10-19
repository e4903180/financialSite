import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { column_sub_list } from '../column/column';

function ScreenComp() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">訂閱清單</h3>
            </div>

            <div className = 'row mx-auto'>
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
        </>
    );
}

export default ScreenComp;