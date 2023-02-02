import React, { useState } from 'react';
import { columns1 } from '../column/column';
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import { GridToolbar } from '@mui/x-data-grid';

function ReasearchItem(props) {
    const [pageSize, setPageSize] = useState(10);

    return (
        <>
            <div className = 'row pt-3 mx-auto'>
                <h3 className = "display-6 text-center">個股研究報告</h3>

                <StripedDataGrid
                    columns = { columns1 }
                    rows = { props.data }
                    pageSize = { pageSize }
                    onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                    rowsPerPageOptions = {[5, 10, 25]}
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