import React, { useState } from 'react';
import TickerSearchComp from '../tickerSearchComp';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { AutoCom } from '../../autoCom';
import { rootApiIP } from '../../constant';

function PricingStratagyCard() {
    var Today = new Date();
    let year = Today.getFullYear()

    const [ticker, setTicker] = useState("")
    const [inputError, setInputError] = useState(false);
    const [method, setMethod] = useState("股利法");
    const [startYear, setStartYear] = useState(10);
    const [endDate, setEndDate] = useState("");
    const [alertCondition, setAlertCondition] = useState("便宜價");
    const [subed, setSubed] = useState(false);
    const [open, setOpen] = useState(false);
    const [subType, setSubType] = useState("Line");

    const autocom = AutoCom.AutoComList;

    const submit = (e) => {
        e.preventDefault()
        setInputError(false)
        setOpen(false)

        if((autocom.map(element => element.stock_num_name).includes(ticker)) && (endDate !== "")){
            axios.post(rootApiIP + "/data/handle_pricing_strategy_sub", {
                "stockNum" : ticker.split(" ")[0],
                "startYear" : startYear,
                "endDate" : endDate,
                "method" : method,
                "subType" : subType,
                "alertCondition" : alertCondition
            }).then((res) => {
                setOpen(true)
                setSubed(false)
            }).catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()
                    
                if(res.response.status === 401){
                    setOpen(true)
                    setSubed(true)
                }
            })
        }else{
            setInputError(true)
        }
    }

    const conditionSwitch = ["便宜價", "合理價", "昂貴價"]

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
                            <label htmlFor = "method" className = "col-md-4 col-form-label">定價方法:</label>
                            <div className = 'col-md-8'>
                                <select id = "method" className = "form-select" onChange = {e => setMethod(e.target.value)} defaultValue = {10}>
                                    <option value = "股利法">股利法</option>
                                    <option value = "高低價法">高低價法</option>
                                    <option value = "本益比法">本益比法</option>
                                    <option value = "本淨比法">本淨比法</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "year" className = "col-md-4 col-form-label">歷史幾年資料:</label>
                            <div className = 'col-md-8'>
                                <select id = "year" className = "form-select" onChange = {e => setStartYear(e.target.value)} defaultValue = {10}>
                                    <option value = "2">2</option>
                                    <option value = "3">3</option>
                                    <option value = "4">4</option>
                                    <option value = "5">5</option>
                                    <option value = "6">6</option>
                                    <option value = "7">7</option>
                                    <option value = "8">8</option>
                                    <option value = "9">9</option>
                                    <option value = "10">10</option>
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "date1" className = "col-md-4 col-form-label">訂閱到期日:</label>
                            <div className = 'col-md-8'>
                                <input type = "date" id = "date1" className = "form-control" onChange = {e => setEndDate(e.target.value)} min = { year.toString() + "-" + (Today.getMonth() + 1).toString().padStart(2, '0') + "-" + Today.getDate().toString().padStart(2, '0') }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "condition" className = "col-md-4 col-form-label">警示條件:</label>
                            <div className = 'col-md-6'>
                                <select id = "condition" className = "form-select" onChange = {e => setAlertCondition(e.target.value)}>
                                    {conditionSwitch.map((ele, idx) => {return <option key = {idx} value = {ele}>{ele}</option>})}
                                </select>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "subType" className = "col-md-4 col-form-label">通知方式:</label>
                            <div className = 'col-md-6'>
                                <select id = "subType" className = "form-select" onChange = {e => setSubType(e.target.value)}>
                                    <option value = "Line">Line</option>
                                    <option value = "Email">Email</option>
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
    )
}

export default PricingStratagyCard;