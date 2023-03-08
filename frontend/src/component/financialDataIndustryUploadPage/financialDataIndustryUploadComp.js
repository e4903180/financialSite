import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';

function FinancialDataIndustryUploadComp() {
    var Today = new Date();
    let year = Today.getFullYear()
    let month = (Today.getMonth() + 1)
    let day = Today.getDate()
    var TodayDate = year.toString() + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0')
    
    const [superUser, setSuperUser] = useState(0)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [date, setDate] = useState(TodayDate);
    const [investmentCompany, setInvestmentCompany] = useState("")

    const saveFile = (e) => {
        if(e.target.files.length !== 0){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }else{
            setFile(null);
            setFileName("");
        }
    };

    const submit = (e) => {
        e.preventDefault()

        if(fileName !== ""){
            const formData = new FormData();

            formData.append("filename", fileName);
            formData.append("investmentCompany", investmentCompany);
            formData.append("category", category);
            formData.append("date", date);
            formData.append("title", title);
            formData.append("selectFile", file);

            axios.post(config["rootApiIP"] + "/data/upload/industry", formData, {
                headers : { "Content-Type": "multipart/form-data" }
            }).then(res => {
                setFile(null)
                setFileName("")
                setInvestmentCompany("NULL")
                setTitle("")
                setDate(TodayDate)
                e.target.reset()
                
                alert("上傳成功")
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }else{
            alert("未選擇檔案")
        }
    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/superUser")
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
            <>
                <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                    <h3 className = "display-6 text-center">產業研究報告上傳</h3>

                    <form onSubmit = { submit }>
                        <div className = 'form-group row py-3'>
                            <label htmlFor = "title" className = "col-md-3 col-form-label text-center">標題:</label>

                            <div className = 'col-md-6'>
                                <input type = "text" id = "title" className = "form-control" onChange = { e => 
                                    setTitle(e.target.value) }></input>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "title" className = "col-md-3 col-form-label text-center">產業類別:</label>

                            <div className = 'col-md-6'>
                                <input type = "text" id = "title" className = "form-control" onChange = { e => 
                                    setCategory(e.target.value) }></input>
                            </div>
                        </div>

                        <div className = 'form-group row'>
                            <label htmlFor = "date" className = "col-md-3 col-form-label text-center">日期:</label>
                            <div className = 'col-md-3'>
                                <input id = "date" type = "date" onChange = { e => setDate(e.target.value) }/>
                            </div>
                        </div>

                        <div className = 'form-group row'>
                            <label htmlFor = "investmentCompany" className = "col-md-3 col-form-label text-center">券商名稱:</label>
                            <div className = 'col-md-3'>
                                <input id = "investmentCompany" type = "text" onChange = { e => setInvestmentCompany(e.target.value) }/>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <label htmlFor = "upload" className = "col-md-3 col-form-label text-center">檔案上傳:</label>
                            <div className = 'col-md-3'>
                                <input type = "file" id = "upload" onChange = { saveFile }/>
                            </div>
                        </div>

                        <div className = 'form-group row py-3'>
                            <div className = 'col-md-12 text-center'>
                                <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>送出</button>
                            </div>
                        </div>
                    </form>
                </div>
            </> : <p color = "red">權限不足</p> }
        </>
    );
}

export default FinancialDataIndustryUploadComp;