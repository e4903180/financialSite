import { Backdrop } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import { columns_popular_ticker } from '../column/column';
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function PopularTicker() {
    const [pageSize, setPageSize] = useState(10)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pageDetail, setPageDetail] = useState(0)
    const [pageSizeDetail, setPageSizeDetail] = useState(10)
    const [detailColumns, setDetailColumns] = useState([])
    const [detailData, setDetailData] = useState([])

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/popular_ticker")
        .then(res => {
            setData(res.data)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto'>
                <div className = 'col-md-6 mx-auto py-3'>
                    <h3 className = "display-6 text-center">一個月內熱門個股Top30</h3>

                    <StripedDataGrid
                        autoHeight
                        columns = { columns_popular_ticker(setLoading, setDetailColumns, setPageDetail, setDetailData) }
                        rows = { data }
                        pageSize = { pageSize }
                        onPageSizeChange = { (newPageSize) => setPageSize(newPageSize) }
                        rowsPerPageOptions = {[10]}
                        getRowId = { row => row.stock_num }
                        pagination
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
            </div>

            <Backdrop
                sx = {{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { loading }
            >
                <div className = 'row mx-auto py-2' style = {{backgroundColor : "white", width : "60vw"}}>
                    <div className = 'col-md-1 offset-11 py-1 text-center'>
                        <HighlightOffIcon onClick = {() => setLoading(false)} style = {{ cursor : "pointer"}}/>
                    </div>

                    <div>
                        <DataGrid
                            columns = { detailColumns }
                            rows = { detailData }
                            page = { pageDetail }
                            onPageChange = {(newPage) => setPageDetail(newPage)}
                            pageSize = { pageSizeDetail }
                            onPageSizeChange = { (newPageSize) => setPageSizeDetail(newPageSize) }
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
                        />
                    </div>
                </div>
            </Backdrop>
        </>
    );
}

export default PopularTicker;