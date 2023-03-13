import React, { useState } from 'react';
import { columns_financialData, columns_financialDataIndustry } from '../column/column';
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import { GridToolbar } from '@mui/x-data-grid';

function ReasearchItem(props) {
    const [pageSize, setPageSize] = useState(20);
    const [pageSize1, setPageSize1] = useState(20);

    return (
        <>
            <div className = 'row pt-3 mx-auto'>
                <h4 className = "text-center">個股研究報告</h4>

                <StripedDataGrid
                    columns = { columns_financialData }
                    rows = { props.data[0] }
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
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                />
            </div>

            <div className = 'row pt-3 mx-auto'>
                <h4 className = "text-center">產業研究報告</h4>

                <StripedDataGrid
                    columns = { columns_financialDataIndustry }
                    rows = { props.data[1] }
                    pageSize = { pageSize1 }
                    onPageSizeChange={ (newPageSize) => setPageSize1(newPageSize) }
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
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                />
            </div>
        </>
    );
}

export default ReasearchItem;