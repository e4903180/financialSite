import { Alert, Backdrop, Button, CircularProgress, Snackbar } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import React, { createContext, useState } from 'react';
import { config } from '../../constant';
import { columns_choose_ticker } from '../column/column';
import AnalysisComp from './analysisComp';
import CurrentConditionComp from './currentConditionComp';
export const ConditionsContext = createContext();

function ChooseTickerComp() {
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [conditions, setConditions] = useState([])
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleConditionsAdd = (newItem) => {
        if(conditions.length >= 3){
            setOpen(true)
            setMessage("篩選條件不能超過3個")
            return
        }
        
        if(conditions.includes(newItem)){
            setOpen(true)
            setMessage("此條件已經選取過")
        }else{
            conditions.push(newItem)
            // this caused a re-render because it is a new object
            setConditions([...conditions])
        };
    }

    const handleConditionsRemove = (removeItem) => {
        const temp = removeItem.split(" ")[1]

        if(conditions.includes(temp)){
            conditions.splice(conditions.indexOf(temp), 1)
            // this caused a re-render because it is a new object
            setConditions([...conditions])
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)

        if(conditions.length === 0){
            setMessage("至少需要一個條件")
            setOpen(true)
            setLoading(false)
            return
        }

        axios.get(config["rootApiIP"] + "/data/filter_ticker", {
            params : {
                "conditions" : conditions
            }
        }).then(res => {
            setData(res.data)
            setLoading(false)
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
            setLoading(false)
        })
    }

    return (
        <>
            <Snackbar open = { open } autoHideDuration = { 3000 } onClose = { handleClose } anchorOrigin = {{ vertical : "top", horizontal : "center" }}>
                <Alert onClose = { handleClose } severity = "error" sx = {{ width: '100%' }}>
                    { message }
                </Alert>
            </Snackbar>

            <Backdrop
                sx = {{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { loading }
            >
                資料載入中&emsp;
                <CircularProgress color = "inherit" />
            </Backdrop>

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">選股</h3>
            </div>

            <div className = 'row mx-auto py-3 text-center' style = {{ width : "60vw" , height : "50vh"}}>
                <ConditionsContext.Provider value = {{conditions, handleConditionsAdd, handleConditionsRemove}}>
                    <AnalysisComp/>
                    <CurrentConditionComp />
                </ConditionsContext.Provider>

                <div className = 'row mx-auto justify-content-center'>
                    <Button variant = "outlined" style = {{ width : "6vw", height : "5vh" }} onClick = { (e) => submit(e) }>篩選</Button>
                </div>
            </div>

            <h3 className = "display-6 text-center">篩選結果</h3>
            <hr className = 'mx-auto' style = {{ width : "95vw" }}/>

            <div className = 'row mx-auto py-3' style = {{ width : "60vw" }}>
                <DataGrid
                    columns = { columns_choose_ticker }
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
                    autoHeight = { true }
                />
            </div>
        </>
    );
}

export default ChooseTickerComp;