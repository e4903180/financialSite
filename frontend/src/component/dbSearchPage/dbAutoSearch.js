import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { columns_financialData, columns_twse, columns_financialDataOther, columns_news } from '../column/column';
import { config } from '../../constant';
import TickerSearchComp from '../tickerSearchComp';
import { AutoCom } from '../../autoCom';

function DbAutoSearch() {
    const param = useParams();
    var date = new Date();
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setDate(1);
    date.setMonth(date.getMonth() - 3);
    
    const last3Month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')

    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page1, setPage1] = useState(0);
    const [pageSize1, setPageSize1] = useState(20);
    const [page2, setPage2] = useState(0);
    const [pageSize2, setPageSize2] = useState(20);
    const [page3, setPage3] = useState(0);
    const [pageSize3, setPageSize3] = useState(20);
    const [page4, setPage4] = useState(0);
    const [pageSize4, setPageSize4] = useState(20);
    const [ticker, setTicker] = useState("");
    const [input1Error, set_input1Error] = useState(false);
    const [input2, setInput2] = useState(last3Month);
    const [input3, setInput3] = useState(today);
    const autocom = AutoCom.AutoComList;

    async function submit(e){
        e.preventDefault()
        setLoading(true)

        setData1([])
        setData2([])
        setData3([])
        setData4([])
        setPage1(0)

        if((ticker !== "") && (!autocom.map(element => element.stock_num_name).includes(ticker))){
            set_input1Error(true)
            setLoading(false)
        }else{
            set_input1Error(false)

            axios.post(config["rootApiIP"] + "/data/financial_search", {
                "stock_num_name" : ticker,
                "startDate" : input2,
                "endDate" : input3,
                "investmentCompany" : "all",
                "remark" : "all"
            }).then(res => {
                setData1(res.data)
                setLoading(false)
                setPage1(0)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()

                setData1([])
                setPage1(0)
            })
            
            axios.get(config["rootApiIP"] + "/data/other_search", { params : {
                "startDate" : input2,
                "endDate" : input3,
                "pattern" : ticker.split(" ")[1],
                "investmentCompany" : ""
            } })
            .then((res) => {
                setData2(res.data)
                setLoading(false)
                setPage2(0)
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()

                setData2([])
                setPage2(0)
            })

            axios.get(config["rootApiIP"] + "/data/news_search", { params :{
                "startDate" : input2,
                "endDate" : input3,
                "column" : "title",
                "pattern" : ticker.split(" ")[1],
                "category" : "all"
            }})
            .then((res) => {
                setData3(res.data)
                setLoading(false)
                setPage3(0)
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()

                setData3([])
                setPage3(0)
            })

            axios.post(config["rootApiIP"] + "/data/calender_search", {
                "stock_num_name" : ticker,
                "startDate" : input2,
                "endDate" : input3,
            }).then(res => {
                setData4(res.data)
                setLoading(false)
                setPage4(0)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()

                setData4([])
                setPage4(0)
            })
        }
    }

    useEffect(() => {
        axios.post(config["rootApiIP"] + "/data/financial_search", {
            "stock_num_name" : param.stock_num_name,
            "startDate" : last3Month,
            "endDate" : today,
            "investmentCompany" : "all",
            "remark" : "all"
        }).then(res => {
            setData1(res.data)
            setLoading(false)
            setPage1(0)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()

            setData1([])
            setPage1(0)
        })

        axios.get(config["rootApiIP"] + "/data/other_search", { params : {
            "startDate" : last3Month,
            "endDate" : today,
            "pattern" : param.stock_num_name.split(" ")[1],
            "investmentCompany" : ""
        } })
        .then((res) => {
            setData2(res.data)
            setLoading(false)
            setPage2(0)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()

            setData2([])
            setPage2(0)
        })
        
        axios.get(config["rootApiIP"] + "/data/news_search", { params :{
            "startDate" : last3Month,
            "endDate" : today,
            "column" : "title",
            "pattern" : param.stock_num_name.split(" ")[1],
            "category" : "all"
        }})
        .then((res) => {
            setData3(res.data)
            setLoading(false)
            setPage3(0)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()

            setData3([])
            setPage3(0)
        })

        axios.post(config["rootApiIP"] + "/data/calender_search", {
            "stock_num_name" : param.stock_num_name,
            "startDate" : last3Month,
            "endDate" : today,
        }).then(res => {
            setData4(res.data)
            setLoading(false)
            setPage4(0)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()

            setData4([])
            setPage4(0)
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto' style = {{ width : "90%", paddingTop : "56px" }}>
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
                                <input type = "date" id = "date1" className = "form-control" onChange = {e => setInput2(e.target.value)} value = { input2 }></input>
                            </div>

                            <label htmlFor = "date2" className = "col-md-1 col-form-label text-center">到</label>
                            <div className = 'col-md-2'>
                                <input type = "date" id = "date2" className = "form-control" onChange = {e => setInput3(e.target.value)} value = { input3 }></input>
                            </div>
                        </div>

                        <div className = 'form-group pt-4 text-center'>
                            { input1Error ? <p style = {{ color : "red" }}>股票代號&名稱格式或資料表錯誤</p> : <></> }
                            {loading ? <button id = 'submit' type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button> : <button id = 'submit' type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                        </div>
                    </form>
                </div>
            </div>

            <h3 className = "display-6 text-center">查詢結果</h3>

            <hr className = 'mx-auto' style = {{ width : "95vw" }}/>

            <div className = 'row mx-auto py-4' style = {{ width : "90%" }}>
                <h4 className = "text-center">個股研究資料</h4>

                <DataGrid
                    columns = { columns_financialData }
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
                    autoHeight
                />
            </div>

            <div className = 'row mx-auto py-4' style = {{ width : "90%" }}>
                <h4 className = "text-center">法說會</h4>

                <DataGrid
                    style = {{ height : "600px" }}
                    columns = { columns_twse }
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
                />
            </div>

            <div className = 'row mx-auto py-4' style = {{ width : "90%", height : "600px" }}>
                <h4 className = "text-center">其他研究報告</h4>

                <DataGrid
                    columns = { columns_financialDataOther }
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

            <div className = 'row mx-auto py-4' style = {{ width : "90%", height : "600px" }}>
                <h4 className = "text-center">新聞</h4>

                <DataGrid
                    columns = { columns_news(param.stock_num_name.split(" ")[1]) }
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
        </>
    );
}

export default DbAutoSearch;