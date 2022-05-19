import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgimage from "../../image/coins_on_chart.jpg"
import { DataGrid } from '@mui/x-data-grid';
axios.defaults.withCredentials = true;

function HomeComp() {
    let [data, setData] = useState([]);

    const columns = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'recommand', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filePath', headerName: '檔案下載', flex: 1, headerAlign: 'center', align: 'center', renderCell : rowData => <a href = { "http://140.116.214.154:3000/api/data/download?filePath=" + rowData.value } download = { rowData.value.split("/")[-1]}>download</a> },
    ];

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/first")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <div className = 'jumbotron jumbotron-fluid d-flex' style = {{ backgroundImage : `url(${bgimage})`, opacity : "0.8", backgroundAttachment : "fixed", backgroundSize : "cover", height : "40vh", justifyContent : "center", alignItems : "center" }}>
                <div className = 'text-center'>
                    <h1 className = "display-4" style = {{ color : "white" }}>Financial Database</h1>
                    <p className = 'lead' style = {{ color : "white" }}>Easily and quickly</p>
                </div>
            </div>
            

            <div className = 'container-fluid'>
                <div className = 'col-md-10 offset-md-1'>
                    <h3 className = "display-4 text-center">最新15筆資料</h3>
                    <DataGrid columns = { columns } rows = { data } pageSize = { 5 } rowsPerPageOptions = {[5]} getRowId = { row => row.ID } autoHeight />
                </div>
            </div>
        </>
    );
}

export default HomeComp;

// /home/cosbi/桌面/financialData/gmailData/data/2887/2887-台新金-2022_5_05-統一投顧.pdf