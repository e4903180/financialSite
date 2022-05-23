import axios from 'axios';
import { CSVLink } from "react-csv";
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function DatabaseComp() {
    let [data, setData] = useState([]);
    let [data1, setData1] = useState([]);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [input5, setInput5] = useState("");

    const columns = [
        { field: "dbName", headerName : "資料表名稱", flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'dataQuantity', headerName: '資料總筆數', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'newestDate', headerName: '最新資料日期', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'allData', headerName: '資料總表下載', flex: 1, headerAlign: 'center', align: 'center', renderCell : rowData => <CSVLink data = { rowData.value } filename = { "financial.csv" }>Download</CSVLink> , sortable: false},
    ];

    const columns1 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'recommend', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filePath', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { "http://140.116.214.154:3000/api/data/download?filePath=" + rowData.value } download = { rowData.value.split("/")[-1]}>Download</a> },
    ];

    function submit(e){
        e.preventDefault()
        setLoading(true)

        axios.post("http://140.116.214.154:3000/api/data/dbsearch", {
            "stockName_or_Num" : input1,
            "startDate" : input2,
            "endDate" : input3,
            "investmentCompany" : input4,
            "dbTable" : input5
        }).then(res => {
            setData1(res.data)
            setSearch(true)
            setLoading(false)
        }).catch(res => {

        })
    }

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/allData")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "40vw" }}>
                <div className = 'col-md-10 mx-auto py-3'>
                    <h3 className = "display-6 text-center">資料庫總表</h3>

                    <DataGrid
                        columns = { columns } 
                        rows = { data }
                        getRowId = { row => row.dbName }
                        autoHeight
                        rowsPerPageOptions = {[1]}
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                    />
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'container-fluid py-3'>
                    <h3 className = "display-6 text-center">資料庫查詢</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row'>
                            <label htmlFor = "stockNum_or_Name" className = "col-md-2 col-form-label text-center">股票代號或名稱:</label>
                            <div className = 'col-md-3'>
                                <input type = "text" id = "stockNum_or_Name" className = "form-control" placeholder = '請輸入股票代號或名稱' onChange = {e => setInput1(e.target.value)}></input>
                            </div>
                            
                            <label htmlFor = "date1" className = "col-md-1 col-form-label text-center">日期:</label>
                            <div className = 'col-md-2'>
                                <input type = "date" id = "date1" className = "form-control" onChange = {e => setInput2(e.target.value)}></input>
                            </div>

                            <label htmlFor = "date2" className = "col-md-1 col-form-label text-center">到</label>
                            <div className = 'col-md-2'>
                                <input type = "date" id = "date2" className = "form-control" onChange = {e => setInput3(e.target.value)}></input>
                            </div>
                        </div>

                        <div className = 'form-group row pt-1'>
                            <label htmlFor = "provider" className = "col-md-2 col-form-label text-center">券商名稱:</label>
                            
                            <div className = 'col-md-3'>
                                <select id = "provider" className = "form-select" onChange = {e => setInput4(e.target.value)}>
                                    <option defaultValue value = "">請選擇券商</option>
                                    <option value = "台新投顧">台新投顧</option>
                                    <option value = "中信投顧">中信投顧</option>
                                    <option value = "元富">元富</option>
                                    <option value = "國票">國票</option>
                                    <option value = "元大">元大</option>
                                    <option value = "統一投顧">統一投顧</option>
                                    <option value = "第一金">第一金</option>
                                    <option value = "富邦台灣">富邦台灣</option>
                                    <option value = "SinoPac">永豐金證券</option>
                                </select>
                            </div>

                            <label htmlFor = "db" className = "col-md-1 col-form-label text-center">資料表:</label>
                            <div className = 'col-md-3'>
                                <select id = "db" className = "form-select" onChange = {e => setInput5(e.target.value)}>
                                    <option defaultValue value = "">請選擇資料表</option>
                                    <option value = "financialData">個股研究資料</option>
                                    <option value = "個股推薦">個股推薦</option>
                                    <option value = "Line Memo">Line Memo</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group pt-4 text-center'>
                            {loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>}
                            {!loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                        </div>
                    </form>
                </div>
            </div>

            { search &&  <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <h3 className = "display-6 text-center">查詢結果</h3>

                <DataGrid
                    columns = { columns1 }
                    rows = { data1 }
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
            </div>}
        </>
    );
}

export default DatabaseComp;