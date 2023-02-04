import React, { useState } from 'react';
import { columns_home_news } from '../column/column';
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import { GridToolbar } from '@mui/x-data-grid';

function NewsItem(props) {
    const [pageSize, setPageSize] = useState(20)

    return (
        <>
            <div className = 'row pt-3'>
                <StripedDataGrid
                    columns = { columns_home_news }
                    rows = { props.data }
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
                    headerHeight = {0}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                />
            </div>
        </>
    );
}

export default NewsItem;