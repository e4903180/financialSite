import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { AutoCom } from '../../autoCom';
import { Alert, Snackbar } from '@mui/material';
import { rootApiIP } from '../../constant';
import axios from 'axios';

function SubSupportResistanceForm(props) {
    var Today = new Date();
    let year = Today.getFullYear()
    let month = (Today.getMonth() + 1) - 1
    const date = 1

    const [stockNum, setStockNum] = useState([{"ID" : 0, "stock_num_name" : ""}]);
    const [inputError, setInputError] = useState(false);
    const [startDate, setStartDate] = useState((year - 5).toString() + "-01-01");
    const [endDate, setEndDate] = useState("");
    const [method, setMethod] = useState("method1");
    const [maLen, setMaLen] = useState(20);
    const [maType, setMaType] = useState("sma");
    const [sub, setSub] = useState(false);
    const [open, setOpen] = useState(false);

    if(month === 0){
        year -= 1
        month = 12
    }

    var TodayDate = year.toString() + "-" + month.toString().padStart(2, '0') + "-" + date.toString().padStart(2, '0')
    const autocom = AutoCom.AutoComList;

    function submit(e){
        e.preventDefault()

        if((stockNum.length !== 0) && (autocom.map(element => element.stock_num_name).includes(stockNum[0]["stock_num_name"]) === true) && (endDate !== "")){
            setInputError(false)
            setOpen(false)

            axios.post(rootApiIP + "/data/handle_support_resistance_sub", {
                "stockNum" : stockNum[0]["stock_num_name"].slice(0, 4),
                "startDate" : startDate,
                "endDate" : endDate,
                "maType" : maType,
                "maLen" : maLen,
                "method" : method,
                "subType" : props.subType
            })
            .then((res) => {
                setOpen(true)
                setSub(false)
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()

                if(res.response.status === 401){
                    setOpen(true)
                    setSub(true)
                }
            })
        }else{
            setInputError(true)
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    return (
        <>
            <div className = "modal fade" id = "checkEndTimeModal" tabIndex = "-1" aria-hidden = "true" data-bs-backdrop = "static">
                <div className = "modal-dialog modal-dialog-centered">
                    <div className = "modal-content">
                        <div className = "modal-header">
                            <h1 className = "modal-title fs-5">訂閱資訊確認</h1>
                            <button type = "button" className = "btn-close" data-bs-dismiss = "modal" aria-label = "Close" onClick = { () => setOpen(false) }></button>
                        </div>

                        <div className = "modal-body">
                            <div className = 'row mx-auto py-3' style = {{ width : "100%" }}>
                                <div>
                                    <div className = 'form-group row'>
                                        <label htmlFor = "stockNum_or_Name" className = "col-md-4 col-form-label">股票代號&名稱:</label>
                                        <div className = 'col-md-8'>
                                            <Typeahead
                                                id = "stockNum_or_Name"
                                                labelKey = "stock_num_name"
                                                onChange = { setStockNum }
                                                options = { autocom }
                                                placeholder = "請輸入股票代號或名稱"
                                                selected = { stockNum }
                                            />
                                        </div>
                                    </div>

                                    <div className = 'form-group row py-3'>
                                        <label htmlFor = "date1" className = "col-md-4 col-form-label">歷史資料起始日:</label>
                                        <div className = 'col-md-8'>
                                            <input type = "date" id = "date1" className = "form-control" onChange = {e => setStartDate(e.target.value)} max = { TodayDate } value = { startDate }></input>
                                        </div>
                                    </div>

                                    <div className = 'form-group row py-3'>
                                        <label htmlFor = "date1" className = "col-md-4 col-form-label">訂閱到期日:</label>
                                        <div className = 'col-md-8'>
                                            <input type = "date" id = "date1" className = "form-control" onChange = {e => setEndDate(e.target.value)} min = { year.toString() + "-" + (Today.getMonth() + 1).toString().padStart(2, '0') + "-" + Today.getDate().toString().padStart(2, '0') }></input>
                                        </div>
                                    </div>

                                    <div className = 'form-group row py-3'>
                                        <label htmlFor = "maLen" className = "col-md-4 col-form-label">MA長度:</label>
                                        <div className = 'col-md-3'>
                                            <select id = "maLen" className = "form-select" onChange = {e => setMaLen(e.target.value)}>
                                                <option value = "20">20</option>
                                                <option value = "30">30</option>
                                                <option value = "50">50</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className = 'form-group row py-3'>
                                        <label htmlFor = "ma" className = "col-md-4 col-form-label">MA類型:</label>
                                        <div className = 'col-md-4'>
                                            <select id = "ma" className = "form-select" onChange = {e => setMaType(e.target.value)}>
                                                <option value = "sma">sma</option>
                                                <option value = "wma">wma</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className = 'form-group row py-3'>
                                        <label htmlFor = "method" className = "col-md-4 col-form-label">計算方式:</label>
                                        <div className = 'col-md-4'>
                                            <select id = "method" className = "form-select" onChange = {e => setMethod(e.target.value)}>
                                                <option value = "method1">方法一</option>
                                                <option value = "method2">方法二</option>
                                                <option value = "method3">方法三</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                { inputError ? <p className = 'text-center' style = {{ color : "red" }}>股票代號&名稱或訂閱到期日格式錯誤</p> : <></> }
                            </div>
                        </div>

                        <div className = "modal-footer">
                            <button type = "button" className = "btn btn-primary mx-auto" onClick = { (e) => submit(e) }>確認</button>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar open = {open} autoHideDuration = { 6000 } onClose = { handleClose } anchorOrigin = {{vertical : "top", horizontal : "center"}}>
                {sub ? 
                    <Alert onClose = { handleClose } severity = "error" sx = {{ width: '100%' }}>
                        已經訂閱過相同參數請再次確認
                    </Alert>
                    :
                    <Alert onClose = { handleClose } severity = "success" sx = {{ width: '100%' }}>
                        {props.subType} 訂閱成功
                    </Alert>
                }
            </Snackbar>
        </>
    );
}

export default SubSupportResistanceForm;