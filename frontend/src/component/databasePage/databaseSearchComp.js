import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { columns, columns1, columns2, columns3, columns4 } from '../column/column';
import { useParams } from 'react-router-dom';
import { AutoCom } from '../../autoCom';
import TickerSearchComp from '../tickerSearchComp';
import { config } from '../../constant';

function DatabaseSearchComp() {
    const param = useParams();
    const [data, setData] = useState([])
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [search, setSearch] = useState(false);
    const [search1, setSearch1] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page1, setPage1] = useState(0);
    const [pageSize1, setPageSize1] = useState(5);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(5);
    const [page3, setPage3] = useState(0);
    const [pageSize3, setPageSize3] = useState(5);
    const [page4, setPage4] = useState(0);
    const [pageSize4, setPageSize4] = useState(10);
    const [columnTable, set_colume_table] = useState([]);
    const [input1Error, set_input1Error] = useState(false);
    const [ticker, setTicker] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [input5, setInput5] = useState("綜合查詢");

    const autocom = AutoCom.AutoComList;

    const searchHandler = (value) => {
        if((value !== "") && (!autocom.map(element => element.stock_num_name).includes(value))){
            set_input1Error(true)
            setLoading(false)
        }else{
            set_input1Error(false)

            if(input5 === "綜合查詢"){
                setSearch(false)

                axios.post(config["rootApiIP"] + "/data/financial_search", {
                    "stock_num_name" : value,
                    "startDate" : input2,
                    "endDate" : input3,
                    "investmentCompany" : input4,
                }).then(res => {
                    setData1(res.data)
                    setSearch1(true)
                    setLoading(false)
                    setPage1(0)
                }).catch(res => {
                    if(res.response.data === "Session expired") window.location.reload()

                    setData1([])
                    setPage1(0)
                })

                axios.post(config["rootApiIP"] + "/data/post_board_search", {
                    "stock_num_name" : value,
                    "startDate" : input2,
                    "endDate" : input3,
                    "recommend" : "",
                    "provider" : ""
                }).then(res => {
                    setData2(res.data)
                    setSearch1(true)
                    setLoading(false)
                    setPage2(0)
                }).catch(res => {
                    if(res.response.data === "Session expired") window.location.reload()

                    setData2([])
                    setPage2(0)
                })

                axios.post(config["rootApiIP"] + "/data/lineMemo_search", {
                    "stock_num_name" : value,
                    "startDate" : input2,
                    "endDate" : input3,
                }).then(res => {
                    setData3(res.data)
                    setSearch1(true)
                    setLoading(false)
                    setPage3(0)
                }).catch(res => {
                    if(res.response.data === "Session expired") window.location.reload()

                    setData3([])
                    setPage3(0)
                })

                axios.post(config["rootApiIP"] + "/data/calender_search", {
                    "stock_num_name" : value,
                    "startDate" : input2,
                    "endDate" : input3,
                }).then(res => {
                    setData4(res.data)
                    setSearch1(true)
                    setLoading(false)
                    setPage4(0)
                }).catch(res => {
                    if(res.response.data === "Session expired") window.location.reload()

                    setData4([])
                    setPage4(0)
                })
            }else{
                setSearch1(false)

                switch(input5){
                    case "financialData" : {
                        axios.post(config["rootApiIP"] + "/data/financial_search", {
                            "stock_num_name" : value,
                            "startDate" : input2,
                            "endDate" : input3,
                            "investmentCompany" : input4,
                        }).then(res => {
                            set_colume_table(columns1)
                            setData1(res.data)
                            setSearch(true)
                            setLoading(false)
                        }).catch(res => {
                            if(res.response.data === "Session expired") window.location.reload()
        
                            setData1([])
                            setPage1(0)
                        })
                        break
                    }

                    case "post_board_memo" : {
                        axios.post(config["rootApiIP"] + "/data/post_board_search", {
                            "stock_num_name" : value,
                            "startDate" : input2,
                            "endDate" : input3,
                            "recommend" : "",
                            "provider" : ""
                        }).then(res => {
                            set_colume_table(columns2)
                            setData1(res.data)
                            setSearch(true)
                            setLoading(false)
                        }).catch(res => {
                            if(res.response.data === "Session expired") window.location.reload()
    
                            setData1([])
                            setSearch(true)
                            setLoading(false)
                        })

                        break
                    }

                    case "lineMemo" : {
                        axios.post(config["rootApiIP"] + "/data/lineMemo_search", {
                            "stock_num_name" : value,
                            "startDate" : input2,
                            "endDate" : input3,
                        }).then(res => {
                            set_colume_table(columns3)
                            setData1(res.data)
                            setSearch(true)
                            setLoading(false)
                        }).catch(res => {
                            if(res.response.data === "Session expired") window.location.reload()
    
                            setData1([])
                            setSearch(true)
                            setLoading(false)
                        })

                        break
                    }

                    case "calender" : {
                        axios.post(config["rootApiIP"] + "/data/calender_search", {
                            "stock_num_name" : value,
                            "startDate" : input2,
                            "endDate" : input3,
                        }).then(res => {
                            set_colume_table(columns4)
                            setData1(res.data)
                            setSearch(true)
                            setLoading(false)
                        }).catch(res => {
                            if(res.response.data === "Session expired") window.location.reload()
    
                            setData1([])
                            setSearch(true)
                            setLoading(false)
                        })

                        break
                    }

                    default: break
                }
            }
        }
    }

    async function submit(e){
        e.preventDefault()

        setData1([])
        setData2([])
        setData3([])
        setData4([])
        setPage1(0)
        set_colume_table([])

        searchHandler(ticker)
    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/allData")
        .then(res => {
            setData(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        searchHandler(param.stock_num_name)
    }, [])

    return (
        <>
            <div className = 'row mx-auto' style = {{ width : "40vw", paddingTop : "56px" }}>
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
                                <TickerSearchComp init = {param.stock_num_name} setTicker = {setTicker}/>
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
                            <label htmlFor = "db" className = "col-md-2 col-form-label text-center">資料表:</label>
                            <div className = 'col-md-3'>
                                <select id = "db" className = "form-select" onChange = {e => { setInput5(e.target.value); setInput4("") }}>
                                    <option value = "綜合查詢">綜合查詢</option>
                                    <option value = "financialData">個股研究資料</option>
                                    <option value = "post_board_memo">個股推薦</option>
                                    <option value = "lineMemo">Line Memo</option>
                                    <option value = "calender">法說會</option>
                                </select>
                            </div>

                            { input5 === "financialData" && <>
                                <label htmlFor = "provider" className = "col-md-1 col-form-label text-center">券商名稱:</label>
                                <div className = 'col-md-3'>
                                    <select id = "provider" className = "form-select" onChange = {e => setInput4(e.target.value)}>
                                        <option value = "">請選擇券商</option>
                                        <option value = "台新投顧">台新投顧</option>
                                        <option value = "中信投顧">中信投顧</option>
                                        <option value = "元富">元富</option>
                                        <option value = "國票">國票</option>
                                        <option value = "元大">元大</option>
                                        <option value = "統一投顧">統一投顧</option>
                                        <option value = "第一金">第一金</option>
                                        <option value = "富邦台灣">富邦台灣</option>
                                        <option value = "SinoPac">永豐金證券</option>
                                        <option value = "CTBC">CTBC</option>
                                        <option value = "永豐投顧">永豐投顧</option>
                                    </select>
                                </div>
                            </>}
                        </div>

                        <div className = 'form-group pt-4 text-center'>
                            { input1Error ? <p style = {{ color : "red" }}>股票代號&名稱格式或資料表錯誤</p> : <></> }
                            { loading ? <button id = 'submit' type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button> : <button id = 'submit' type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                        </div>
                    </form>
                </div>
            </div>

            { search  && <div className = 'row mx-auto py-3' style = {{ width : "90%", height : "900px" }}>
                <h3 className = "display-6 text-center">查詢結果</h3>
                <hr className = 'mx-auto' style = {{ width : "95vw" }}/>

                <DataGrid
                    columns = { columnTable }
                    rows = { data1 }
                    page = { page1 }
                    onPageChange={(newPage) => setPage1(newPage)}
                    pageSize = { pageSize1 }
                    onPageSizeChange={ (newPageSize) => setPageSize1(newPageSize) }
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
                />
            </div>}

            { search1 &&  <>
                <h3 className = "display-6 text-center">查詢結果</h3>

                <hr className = 'mx-auto' style = {{ width : "95vw" }}/>

                <div className = 'row mx-auto py-4' style = {{ width : "90%", height : "400px" }}>
                    <h4 className = "text-center">個股研究資料</h4>

                    <DataGrid
                        columns = { columns1 }
                        rows = { data1 }
                        page = { page1 }
                        onPageChange={(newPage) => setPage1(newPage)}
                        pageSize = { pageSize1 }
                        onPageSizeChange={ (newPageSize) => setPageSize1(newPageSize) }
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
                    />
                </div>

                <div className = 'row mx-auto py-4' style = {{ width : "90%", height : "400px" }}>
                    <h4 className = "text-center">Post board memo</h4>

                    <DataGrid
                        columns = { columns2 }
                        rows = { data2 }
                        page = { page2 }
                        onPageChange={(newPage) => setPage2(newPage)}
                        pageSize = { pageSize2 }
                        onPageSizeChange={ (newPageSize) => setPageSize2(newPageSize) }
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
                    />
                </div>

                <div className = 'row mx-auto py-4' style = {{ width : "90%", height : "400px" }}>
                    <h4 className = "text-center">Line memo</h4>

                    <DataGrid
                        columns = { columns3 }
                        rows = { data3 }
                        page = { page3 }
                        onPageChange={(newPage) => setPage3(newPage)}
                        pageSize = { pageSize3 }
                        onPageSizeChange={ (newPageSize) => setPageSize3(newPageSize) }
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
                    />
                </div>


                <div className = 'row mx-auto py-4' style = {{ width : "90%" }}>
                    <h4 className = "text-center">法說會</h4>

                    <DataGrid
                        columns = { columns4 }
                        rows = { data4 }
                        page = { page4 }
                        onPageChange={(newPage) => setPage4(newPage)}
                        pageSize = { pageSize4 }
                        onPageSizeChange={ (newPageSize) => setPageSize4(newPageSize) }
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
                        autoHeight = { true }
                    />
                </div>
            </>}
        </>
    );
}

export default DatabaseSearchComp;