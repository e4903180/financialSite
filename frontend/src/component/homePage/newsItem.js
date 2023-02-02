import React, { useState } from 'react';
import { columns_home_news } from '../column/column';
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import { GridToolbar } from '@mui/x-data-grid';

function NewsItem(props) {
    const [pageSize1, setPageSize1] = useState(10)
    const [pageSize2, setPageSize2] = useState(10)
    const [pageSize3, setPageSize3] = useState(10)
    const table = [
        { "pageSize" : pageSize1, "setPageSize" : setPageSize1, "title" : "工商時報" },
        { "pageSize" : pageSize2, "setPageSize" : setPageSize2, "title" : "MoneyDj" },
        { "pageSize" : pageSize3, "setPageSize" : setPageSize3, "title" : "經濟日報" }
    ]

    return (
        <>
            <div className = 'row pt-3'>
                {
                    table.map((ele, idx) => {
                        return(
                            <div className = 'col-md-4' key = { idx }>
                                <h3 className = "display-6 text-center">{ ele["title"] }</h3>

                                <StripedDataGrid
                                    columns = { columns_home_news }
                                    rows = { props.data[idx] }
                                    pageSize = { ele["pageSize"] }
                                    onPageSizeChange={ (newPageSize) => ele["setPageSize"](newPageSize) }
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
                        )
                    })
                }
            </div>
        </>
    );
}

export default NewsItem;