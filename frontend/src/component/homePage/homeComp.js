import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgimage from "../../image/coins_on_chart.jpg"
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

axios.defaults.withCredentials = true;

function HomeComp() {
    let [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(5);

    const columns = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'recommend', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filePath', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { "http://140.116.214.154:3000/api/data/download/singleFile?filePath=" + rowData.value } download = { rowData.value.split("/")[-1]}>Download</a> },
    ];

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/newest15")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <div className = 'jumbotron jumbotron-fluid d-flex' style = {{ backgroundImage : `url(${bgimage})`, opacity : "0.8", backgroundAttachment : "fixed", backgroundSize : "cover", height : "60vh", justifyContent : "center", alignItems : "center" }}>
                <div className = 'text-center'>
                    <h1 className = "display-4" style = {{ color : "white" }}>Financial Database</h1>
                    <p className = 'lead' style = {{ color : "white" }}>Easily and quickly</p>
                </div>
            </div>

            <div className = 'container-fluid'>
                <div className = 'col-md-10 mx-auto py-3'>
                    <h3 className = "display-4 text-center">最新15筆資料</h3>
                    <DataGrid
                        columns = { columns } 
                        rows = { data }
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
            </div>
        </>
    );
}

export default HomeComp;