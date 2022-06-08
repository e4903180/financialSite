import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import IndustryAnalysisUploadComp from './Industry_analysis_uploadComp';
import { rootApiIP } from '../../constant'

function IndustryAnalysisComp() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const columns = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'username', headerName: '上傳者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '上傳日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'title', headerName: '上傳檔案標題', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
        { field: 'fileName', headerName: '上傳檔案名稱', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { rootApiIP + "/data/download/single_industry_analysis?filename=" + rowData.value } download = { rowData.value }>Download</a>  },
    ];

    useEffect(() => {
        axios.get(rootApiIP + "/data/industry_analysis")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <IndustryAnalysisUploadComp />

            <div className = 'row mx-auto mt-5 text-center' style = {{ width : "80%" }}>
                <DataGrid
                    columns = { columns }
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
                    autoHeight
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

export default IndustryAnalysisComp;