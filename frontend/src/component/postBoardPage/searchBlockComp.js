import { withStyles } from '@mui/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import CustomA from '../customA';

function SearchBlockComp() {
    const [dataQuantity, set_dataQuantity] = useState(0)
    const [newestDate, set_newestDate] = useState("")
    const [input1, setInput1] = useState([])
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [input4, setInput4] = useState("");
    const [input5, setInput5] = useState("");
    const [loading, setLoading] = useState(false);
    const [autocom, setAutocom] = useState([])
    const [data, setData] = useState([]);
    const [search, setSearch] = useState(false);
    const [pageSize, setPageSize] = useState(5);

    const StyledDataGrid = withStyles({
        root: {
          "& .MuiDataGrid-renderingZone": {
            maxHeight: "none !important"
          },
          "& .MuiDataGrid-cell": {
            lineHeight: "unset !important",
            maxHeight: "none !important",
            whiteSpace: "normal"
          },
          "& .MuiDataGrid-row": {
            maxHeight: "none !important"
          }
        }
    })(DataGrid);

    const columns = [
        { field: "ID", headerName : "ID", flex: 1, headerAlign: 'center', align: 'center', hide : 'true' },
        { field: 'stockNum', headerName: '股票代號', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockName', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'username', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'evaluation', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'filePath', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : rowData => (checkNULL(rowData.value)) },
    ];

    const checkNULL = (value) => {
        if(value === "NULL"){
            return <> </>
        }else{
            return <CustomA value = { value } />
        }
    }

    function submit(e){
        e.preventDefault();
        setLoading(true)

        axios.post("http://140.116.214.154:3000/api/data/post_board_search", {
            "stockName_or_Num" : input1,
            "startDate" : input2,
            "endDate" : input3,
            "recommend" : input4,
            "provider" : input5
        }).then(res => {
            console.log(res.data)
            setData(res.data)
            setSearch(true)
            setLoading(false)
        }).catch(res => {
            setData({})
            setSearch(true)
            setLoading(false)
        })
    }

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/autoCom")
        .then(res => {
            setAutocom(res.data);
        }).catch(res => {
        })

        axios.get("http://140.116.214.154:3000/api/data/post_board_state")
        .then(res => {
            set_dataQuantity(res.data.dataQuantity)
            set_newestDate(res.data.newestDate)
        }).catch(res => {

        })
    }, [])

    return (
        <>
            <form onSubmit = { submit }>
                <p className = 'mt-2'>資料總筆數:{dataQuantity} 最新資料日期: {newestDate} 資料總表下載: <a href = 'http://140.116.214.154:3000/api/data/download/post_board_memo' download = {"post_board_memo.csv"}>點此</a></p>

                <div className = 'form-group row my-2'>
                    <label htmlFor = "stockNum_or_Name" className = "col-md-2 col-form-label text-center">股票代號或名稱:</label>
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
                            <option value = "" defaultValue>請選擇評價</option>
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
                    {loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }} disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>}
                    {!loading && <button type = "submit" className = "btn btn-primary" style = {{ width : "200px" }}>搜尋</button>}
                </div>
            </form>

            { search &&  <div className = 'row mx-auto py-4' style = {{ width : "100%" }}>
                <h3 className = "display-6 text-center">查詢結果</h3>

                <StyledDataGrid
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
            </div>}
        </>
    );
}

export default SearchBlockComp;