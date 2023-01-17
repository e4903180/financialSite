import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AutoCom } from '../../autoCom';
import { rootApiIP } from '../../constant';
import TickerSearchComp from '../tickerSearchComp';

const autocom = AutoCom.AutoComList;

function SelfUploadPage() {
    var Today = new Date();
    let year = Today.getFullYear()
    let month = (Today.getMonth() + 1)
    let day = Today.getDate()
    var TodayDate = year.toString() + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0')
    
    const [superUser, setSuperUser] = useState(0)
    const [ticker, setTicker] = useState("")
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [provider, setProvider] = useState("NULL");
    const [evaluate, setEvaluate] = useState("NULL");
    const [date, setDate] = useState(TodayDate)

    const saveFile = (e) => {
        if(e.target.files.length !== 0){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }else{
            setFile(null);
            setFileName("");
        }
    };

    function submit(e){
        e.preventDefault();

        if((fileName !== "") && (autocom.map(element => element.stock_num_name).includes(ticker))){
            const formData = new FormData();

            formData.append("filename", fileName);
            formData.append("provider", provider);
            formData.append("evaluate", evaluate);
            formData.append("date", date);
            formData.append("ticker", ticker);
            formData.append("selectFile", file);

            axios.post(rootApiIP + "/data/upload/self_upload", formData, {
                headers : { "Content-Type": "multipart/form-data" }
            }).then(res => {
                setFile(null)
                setFileName("")
                setProvider("NULL")
                setEvaluate("NULL")
                setTicker("")
                setDate(TodayDate)
                
                alert("上傳成功")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }else{
            alert("未選擇檔案或股票代號名稱錯誤")
        }
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/superUser")
        .then((res) => {
            setSuperUser(res.data[0]["superUser"])
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            { superUser === 1 ?
                <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                    <h3 className = "display-6 text-center">個股研究報告上傳</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row my-2'>
                            <label htmlFor = "ticker" className = "col-md-2 col-form-label text-center">股票代號&名稱:</label>
                            <div className = 'col-md-3'>
                                    <TickerSearchComp init = "" setTicker = {setTicker}/>
                            </div>
                        </div>

                        <div className = 'form-group row'>
                            <label htmlFor = "date" className = "col-md-2 col-form-label text-center">日期:</label>
                            <div className = 'col-md-3'>
                                <input id = "date" type = "date" onChange = { e => setDate(e.target.value) } value = { TodayDate }/>
                            </div>
                        </div>

                        <div className = 'form-group row'>
                            <label htmlFor = "provider" className = "col-md-2 col-form-label text-center">券商名稱:</label>
                            <div className = 'col-md-3'>
                                <input id = "provider" type = "text" onChange = { e => setProvider(e.target.value) }/>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "upload" className = "col-md-2 col-form-label text-center">檔案上傳:</label>
                            <div className = 'col-md-3'>
                                <input type = "file" id = "upload" onChange = { saveFile }/>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "evaluate" className = "col-md-2 col-form-label text-center">評價:</label>
                            <div className = 'col-md-3'>
                                <input id = "evaluate" type = "text" onChange = { e => setEvaluate(e.target.value) }/>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <div className = 'col-md-12 text-center'>
                                <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>送出</button>
                            </div>
                        </div>
                    </form>
                </div> : <p color = "red">權限不足</p> }
        </>
    );
}

export default SelfUploadPage;