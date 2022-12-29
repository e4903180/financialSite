import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { AutoCom } from '../../autoCom';
import { rootApiIP } from '../../constant';
import TickerSearchComp from '../tickerSearchComp';

function SupportResisCard(props) {
    var Today = new Date();
    let year = Today.getFullYear()
    let month = (Today.getMonth() + 1) - 1
    const date = 1

    if(month === 0){
        year -= 1
        month = 12
    }

    var TodayDate = year.toString() + "-" + month.toString().padStart(2, '0') + "-" + date.toString().padStart(2, '0')
    const autocom = AutoCom.AutoComList;

    const [ticker, setTicker] = useState("")
    const [inputError, setInputError] = useState(false);
    const [startDate, setStartDate] = useState((year - 5).toString() + "-01-01");
    const [endDate, setEndDate] = useState("");
    const [method, setMethod] = useState("method1");
    const [maLen, setMaLen] = useState(20);
    const [maType, setMaType] = useState("sma");
    const [alertCondition, setAlertCondition] = useState("突破天花板線");
    const [subed, setSubed] = useState(false);
    const [open, setOpen] = useState(false);

    const conditionSwitch = {
        "method1" : [
            "突破天花板線",
            "突破地板線"
        ],
        "method2" : [
            "突破地板線"
        ],
        "method3" : [
            "突破地板線1%",
            "突破地板線5%"
        ]
    }

    const submit = async (e) => {
        e.preventDefault()
        setInputError(false)
        setOpen(false)

        if((autocom.map(element => element.stock_num_name).includes(ticker)) && (endDate !== "")){
            try {
                await axios.post(rootApiIP + "/data/handle_support_resistance_sub", {
                    "stockNum" : ticker.split(" ")[0],
                    "startDate" : startDate,
                    "endDate" : endDate,
                    "maType" : maType,
                    "maLen" : maLen,
                    "method" : method,
                    "alertCondition" : alertCondition
                })

                setOpen(true)
                setSubed(false)
            } catch (error) {
                if(error.response.data === "Session expired") window.location.reload()
                    
                if(error.response.status === 401){
                    setOpen(true)
                    setSubed(true)
                }
            }

            try {
                const response = await axios.get(rootApiIP + "/data/get_sub")

                props.setRows(response.data)
            } catch (error) {
                if(error.response.data === "Session expired") window.location.reload()
            }
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
            <div className = "card-body">
                <div className = 'row mx-auto' style = {{width : "60%"}}>
                    <form onSubmit = { submit }>
                        <div className = 'form-group row'>
                            <label htmlFor = "ticker" className = "col-md-4 col-form-label">股票代號&名稱:</label>
                            <div className = 'col-md-8'>
                                <TickerSearchComp init = "" setTicker = { setTicker } />
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
                                <select id = "method" className = "form-select" onChange = {e => {
                                    setMethod(e.target.value)
                                    setAlertCondition(conditionSwitch[e.target.value][0])
                                    }}>
                                    <option value = "method1">方法一</option>
                                    <option value = "method2">方法二</option>
                                    <option value = "method3">方法三</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "condition" className = "col-md-4 col-form-label">警示條件:</label>
                            <div className = 'col-md-6'>
                                <select id = "condition" className = "form-select" onChange = {e => setAlertCondition(e.target.value)}>
                                    {conditionSwitch[method].map((ele, idx) => {return <option key = {idx} value = {ele}>{ele}</option>})}
                                </select>
                            </div>
                        </div>

                        { inputError ? <p className = 'text-center' style = {{ color : "red" }}>股票代號&名稱或訂閱到期日格式錯誤</p> : <></> }

                        <div className = 'form-group row py-3 '>
                            <div className = 'col-md-12 text-center'>
                                <button type = "button" className = "btn btn-primary" style = {{width : "30%"}} onClick = { (e) => submit(e) }>訂閱</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Snackbar open = {open} autoHideDuration = { 3000 } onClose = { handleClose } anchorOrigin = {{vertical : "top", horizontal : "center"}}>
                {subed ? 
                    <Alert onClose = { handleClose } severity = "error" sx = {{ width: '100%' }}>
                        已經訂閱過相同參數請再次確認
                    </Alert>
                    :
                    <Alert onClose = { handleClose } severity = "success" sx = {{ width: '100%' }}>
                        天花板地板線警示訂閱成功
                    </Alert>
                }
            </Snackbar>
        </>
    );
}

export default SupportResisCard;