import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function SelfEditComp() {
    var date = new Date();
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setDate(1);
    date.setMonth(date.getMonth() - 3);
    
    const last3Month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')

    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [superUser, setSuperUser] = useState(0)

    function handle_sub_list_cancel(rowData){
        axios.delete(rootApiIP + "/data/financial_delete", {
            data : {
                ID : rowData.row.ID
            }
        })
        .then(res => {
            setData(data.filter((data) => data.ID !== rowData.row.ID));
        })
        .catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    const columns1_edit = [
        { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'investmentCompany', headerName: '提供者', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'recommend', headerName: '推薦', flex: 1, headerAlign: 'center', align: 'center', editable: true },
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => <a href = { rootApiIP + "/data/download/single_financialData?filename=" + rowData.value } 
        target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a> },
        { field: 'edit', headerName: '確認修改', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : (params) => {
            const onClick = (e) => {
                const thisRow = params.row
    
                axios.patch(rootApiIP + "/data/financial_recommend", {
                    "ticker_id" : thisRow.ticker_id,
                    "date" : thisRow.date,
                    "investmentCompany" : thisRow.investmentCompany,
                    "filename" : thisRow.filename,
                    "recommend" : thisRow.recommend,
                }).then(res => {
                    alert("成功")
                }).catch(res => {
                    if(res.response.data === "Session expired") window.location.reload()
                    alert("失敗")
                })
            }
    
            return <button onClick = { onClick }>修改</button>
        }},
        { field: 'action', headerName: '取消訂閱', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : 
        rowData => <DeleteOutlineIcon style = {{ cursor : "pointer" }} onClick = {() => handle_sub_list_cancel(rowData)}/>},
    ];

    useEffect(() => {
        axios.get(rootApiIP + "/data/superUser")
        .then((res) => {
            setSuperUser(res.data[0]["superUser"])

            axios.post(rootApiIP + "/data/financial_search", {
                "stock_num_name" : "",
                "startDate" : last3Month,
                "endDate" : today,
                "investmentCompany" : "",
            }).then(res => {
                setData(res.data)
                setPage(0)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
    
                setData([])
                setPage(0)
            })
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            { superUser === 1 ? 
                <div className = 'row mx-auto'>
                    <DataGrid
                        columns = { columns1_edit }
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
                        autoHeight
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </div> : <p color = "red">權限不足</p> }
        </>
    );
}

export default SelfEditComp;