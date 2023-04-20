import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { config } from '../../constant';

function OtherEditComp() {
    var date = new Date();
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    date.setDate(1);
    date.setMonth(date.getMonth() - 3);
    
    const last3Month = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')

    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [superUser, setSuperUser] = useState(0)

    function handle_delete(rowData){
        axios.delete(config["rootApiIP"] + "/data/financialDataIndustry", {
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

    const columns_financialDataIndustry_edit = [
        { field: "date", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
        { field: "investmentCompany", headerName : "投顧公司", flex: 1, headerAlign: 'center', align: 'center' },
        { field: "title", headerName : "標題", flex: 1, headerAlign: 'center', align: 'center', editable: true },
        { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
            renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_financialDataIndustry?filename=" + rowData.value } 
        target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a> },
        { field: 'edit', headerName: '確認修改', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
            renderCell : (params) => {
                const onClick = (e) => {
                    const thisRow = params.row
        
                    axios.patch(config["rootApiIP"] + "/data/financialDataIndustry_title", {
                        "date" : thisRow.date,
                        "title" : thisRow.title,
                        "investmentCompany" : thisRow.investmentCompany,
                        "filename" : thisRow.filename,
                    }).then(res => {
                        alert("成功")
                    }).catch(res => {
                        if(res.response.data === "Session expired") window.location.reload()
                        alert("失敗")
                    })
                }
        
                return <button onClick = { onClick }>修改</button>
            }
        },
        { field: 'action', headerName: '刪除', flex: 1, headerAlign: 'center', sortable: false, align: 'center', renderCell : 
        rowData => <DeleteOutlineIcon style = {{ cursor : "pointer" }} onClick = {() => handle_delete(rowData)}/>},
    ];

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/superUser")
        .then((res) => {
            setSuperUser(res.data[0]["superUser"])

            axios.get(config["rootApiIP"] + "/data/other_search", { params : {
                "startDate" : last3Month,
                "endDate" : today,
                "pattern" : "",
                "investmentCompany" : "all"
            } })
            .then((res) => {
                setData(res.data)
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()
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
                        columns = { columns_financialDataIndustry_edit }
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

export default OtherEditComp;