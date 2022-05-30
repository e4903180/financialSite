import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typeahead } from 'react-bootstrap-typeahead';
import CustomA from '../customA';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

function DatabaseComp() {
    let [data, setData] = useState([]);
    let [data1, setData1] = useState([]);
    const [search, setSearch] = useState(false);
    const [autocom, setAutocom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [columnTable, set_colume_table] = useState([]);
    const [input1, setInput1] = useState([]);
    const [input1Error, set_input1Error] = useState(false);
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [input5, setInput5] = useState("");

    const check_single_post_board_memo_NULL = (value) => {
        if(value === "NULL"){
            return <> </>
        }else{
            return <CustomA value = { "http://140.116.214.154:3000/api/data/download/single_post_board_memo?filename=" + value } />
        }
    }

    const check_single_lineMemo_memo_NULL = (value) => {
        if(value === "NULL"){
            return <> </>
        }else{
            return <CustomA value = { "http://140.116.214.154:3000/api/data/download/single_line_memo?filename=" + value } />
        }
    }

    const columns = [
        { field: "dbName", headerName : "資料表名稱", flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'dataQuantity', headerName: '資料總筆數', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'newestDate', headerName: '最新資料日期', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'downloadUrl', headerName: '資料總表下載', flex: 1, headerAlign: 'center', align: 'center', renderCell : rowData => <a href = { rowData.value } download = { rowData.value.split("/")[-1] + ".csv" }>Download</a> , sortable: false},
    ];

    const columns1 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'recommend', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => <a href = { "http://140.116.214.154:3000/api/data/download/single_financialData?filename=" + rowData.value } download = { rowData.value}>Download</a> },
    ];

    const columns2 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'evaluation', headerName: '評價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'price', headerName: '目標價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'reason', headerName: '理由', headerAlign: 'center', align: 'center', sortable: false, width: 400 },
        { field: 'filename', headerName: '檔案下載', headerAlign: 'center', sortable: false, align: 'center', renderCell : (rowData) => (check_single_post_board_memo_NULL(rowData.value))},
    ];

    const columns3 = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => (check_single_lineMemo_memo_NULL(rowData.value)) },
        { field: 'inputTime', headerName: '評價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
        { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
    ];

    function submit(e){
        e.preventDefault()
        setLoading(true)

        if(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value !== "" && !autocom.map(element => element.stock_num_name).includes(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value)){
            set_input1Error(true)
            setLoading(false)
            setData([])
            setPage(0)
        }else{
            set_input1Error(false)
            axios.post("http://140.116.214.154:3000/api/data/dbsearch", {
                "stockName_or_Num" : input1,
                "startDate" : input2,
                "endDate" : input3,
                "investmentCompany" : input4,
                "dbTable" : input5
            }).then(res => {
                switch(input5){
                    case "financialData":{
                        set_colume_table(columns1)
                        break
                    }
    
                    case "post_board_memo":{
                        set_colume_table(columns2)
                        break
                    }
    
                    case "lineMemo":{
                        set_colume_table(columns3)
                        break
                    }
    
                    default : break
                }
                setData1(res.data)
                setSearch(true)
                setLoading(false)
                setPage(0)
            }).catch(res => {
                setData1([])
                setSearch(true)
                setLoading(false)
                setPage(0)
            })
        }
    }

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/allData")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })

        axios.get("http://140.116.214.154:3000/api/data/autoCom")
        .then(res => {
            setAutocom(res.data);
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
                            <label htmlFor = "stockNum_or_Name" className = "col-md-2 col-form-label text-center">股票代號&名稱:</label>
                            <div className = 'col-md-3'>
                                <Typeahead
                                    id = "stockNum_or_Name"
                                    labelKey = "stock_num_name"
                                    onChange = { setInput1 }
                                    options = { autocom }
                                    placeholder = "請輸入股票代號或名稱"
                                    selected = { input1 }
                                />
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
                                    <option value = "post_board_memo">個股推薦</option>
                                    <option value = "lineMemo">Line Memo</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group pt-4 text-center'>
                            { input1Error ? <p style = {{ color : "red" }}>股票代號&名稱格式錯誤</p> : <></> }
                            {loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>}
                            {!loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                        </div>
                    </form>
                </div>
            </div>

            { search &&  <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <h3 className = "display-6 text-center">查詢結果</h3>

                <DataGrid
                    columns = { columnTable }
                    rows = { data1 }
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
            </div>}
        </>
    );
}

export default DatabaseComp;