import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AutoCom } from '../../../autoCom';
import { config } from '../../../constant';
import TickerSearchComp from '../../tickerSearchComp';
var FormData = require('form-data');

function InputBlockComp() {
    const [input1Validation, set_input1Validation] = useState(false)
    const [input2, setInput2] = useState("")
    const [input3, setInput3] = useState("")
    const [input4, setInput4] = useState("")
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [username, setUsername] = useState("")
    const [ticker, setTicker] = useState("")
    const typeaheadRef = useRef(null);
    var Today = new Date();
    const autocom = AutoCom.AutoComList;
    
    function submit(e){
        e.preventDefault()

        if((!autocom.map(element => element.stock_num_name).includes(ticker))){
            set_input1Validation(true)
        }else{
            set_input1Validation(false)

            const formData = new FormData();
            formData.append("stock_num_name", ticker);
            formData.append("date", Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0'))
            formData.append("recommend", input2);
            formData.append("price", input3);
            formData.append("reason", input4);
            formData.append("selectFile", file);
            formData.append("filename", fileName);

            axios.post(config["rootApiIP"] + "/data/upload/post_board_upload", formData, {
                headers : { "Content-Type": "multipart/form-data" }
            }).then(res => {
                setTicker("")
                setInput2("")
                setInput3("")
                setInput4("")
                setFile(null)
                setFileName("")

                typeaheadRef.current.clear()
                e.target.reset()
                alert("上傳成功")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }
    }
    
    const saveFile = (e) => {
        if(e.target.files.length !== 0){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }else{
            setFile(null);
            setFileName("");
        }
    };

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/username")
        .then(res => {
            setUsername(res.data)
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <form className = 'row mx-auto' onSubmit = { submit } noValidate style = {{ width : "70%" }}>
                <h3 className = "text-center mt-2">個股推薦資料輸入</h3>

                <div className = "form-row px-5">
                    <div className = "form-group">
                        <label htmlFor = "stock_num_name">股票代號&名稱:</label>
                        <TickerSearchComp init = "" setTicker = {setTicker} reference = { typeaheadRef }/>
                        { input1Validation ? <div style = {{ color : "red" }}>此欄位為必填或格式錯誤</div> : <></> }
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "date">日期:</label>
                        <input type = "text" className = "form-control" id = "date" value = { Today.getFullYear() + "-" + String(Today.getMonth()+1).padStart(2, '0') + "-" + String(Today.getDate()).padStart(2, '0') } disabled style = {{ opacity : 0.8 }}/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "username">使用者:</label>
                        <input type = "text" className = "form-control" id = "username" value = { username } disabled style = {{ opacity : 0.8 }}/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "recommend">評價:</label>

                        <select id = "recommend" className = "form-select" onChange = { event => setInput2(event.target.value) }>
                            <option value = "">請選擇評價</option>
                            <option value = "買進">買進</option>
                            <option value = "中立">中立</option>
                            <option value = "賣出">賣出</option>
                        </select>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "targetPrice">目標價:</label>
                        <input type = "number" className = "form-control" id = "targetPrice" placeholder = '請輸入預估價位' onChange = { event => setInput3(event.target.value) }/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "reason">理由:</label>
                        <textarea type = "text" className = "form-control" id = "reason" placeholder = '請輸入理由' onChange = { event => setInput4(event.target.value) } style = {{ resize : 'none' }}/>
                    </div>
                </div>

                <div className = "form-row px-5 pt-4">
                    <div className = "form-group">
                        <label htmlFor = "upload">檔案上傳(Optional):</label>
                        <input type = "file" className = "form-control" id = "upload" onChange = { saveFile }/>
                    </div>
                </div>

                <div className = "px-5 py-4">
                    <button id = "registerButton" type = "submit" className = "btn btn-primary">送出</button>
                </div>
            </form>
        </>
    );
}

export default InputBlockComp;