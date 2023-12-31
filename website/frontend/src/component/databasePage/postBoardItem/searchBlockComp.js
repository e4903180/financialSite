import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useState } from 'react';
import TickerSearchComp from '../../tickerSearchComp';
import { AutoCom } from '../../../autoCom';
import { config } from '../../../constant';
import { columns_post_board_memo } from '../../column/column';

function SearchBlockComp() {
    const [input1Error, set_input1Error] = useState(false);
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [input5, setInput5] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [ticker, setTicker] = useState("")

    const autocom = AutoCom.AutoComList;

    function submit(e){
        e.preventDefault();
        setLoading(true)

        if(ticker !== "" && !autocom.map(element => element.stock_num_name).includes(ticker)){
            set_input1Error(true)
            setLoading(false)
            setData([])
            setPage(0)
        }else{
            set_input1Error(false)

            axios.get(config["rootApiIP"] + "/data/post_board_search", {params : {
                "stock_num_name" : ticker,
                "startDate" : input2,
                "endDate" : input3,
                "recommend" : input4,
                "provider" : input5
            }}).then(res => {
                setData(res.data)
                setLoading(false)
                setPage(0)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                setData([])
                setLoading(false)
                setPage(0)
            })
        }
    }

    return (
        <>
            <form className = 'mx-auto' onSubmit = { submit } style = {{ width : "70%" }}>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "stockNum_or_Name" className = "col-md-2 col-form-label text-center">股票代號&名稱:</label>
                    <div className = 'col-md-3'>
                        <TickerSearchComp init = "" setTicker = {setTicker}/>
                    </div>
                </div>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "date1" className = "col-md-2 col-form-label text-center">日期:</label>
                    <div className = 'col-md-3'>
                        <input type = "date" id = "date1" className = "form-control" onChange = {e => setInput2(e.target.value)}></input>
                    </div>

                    <label htmlFor = "date2" className = "col-md-1 col-form-label text-center">到</label>
                    <div className = 'col-md-3'>
                        <input type = "date" id = "date2" className = "form-control" onChange = {e => setInput3(e.target.value)}></input>
                    </div>
                </div>

                <div className = "form-group row my-2">
                    <label htmlFor = "recommend" className = "col-md-2 col-form-label text-center">評價:</label>

                    <div className = 'col-md-2'>
                        <select id = "recommend" className = "form-select" style = {{ width : "auto" }} onChange = { event => setInput4(event.target.value) }>
                            <option value = "">請選擇評價</option>
                            <option value = "買進">買進</option>
                            <option value = "中立">中立</option>
                            <option value = "賣出">賣出</option>
                        </select>
                    </div>
                </div>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "investmentCompany" className = "col-md-2 col-form-label text-center">提供者:</label>
                    <div className = 'col-md-3'>
                        <input type = "text" id = "investmentCompany" className = "form-control" onChange = {e => setInput5(e.target.value)}></input>
                    </div>
                </div>

                <div className = 'form-group pt-4 text-center'>
                    { input1Error ? <p style = {{ color : "red" }}>股票代號&名稱格式錯誤</p> : <></> }
                    {loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>}
                    {!loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                </div>
            </form>

            <div className = 'row mx-auto py-3'>
                <h3 className = "text-center">查詢結果</h3>

                <DataGrid
                    autoHeight
                    columns = { columns_post_board_memo }
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

export default SearchBlockComp;