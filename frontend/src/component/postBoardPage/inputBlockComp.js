import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

function InputBlockComp() {
    const [input1, setInput1] = useState([])
    const [input2, setInput2] = useState("")
    const [input3, setInput3] = useState("")
    const [input4, setInput4] = useState("")
    const [input5, setInput5] = useState("")
    const [autocom, setAutocom] = useState([])
    const [username, setUsername] = useState("")
    var Today = new Date();

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/autoCom")
        .then(res => {
            setAutocom(res.data);
        }).catch(res => {
        })

        axios.get("http://140.116.214.154:3000/api/data/username")
        .then(res => {
            setUsername(res.data)
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <form className = 'row'>
                <div className = "form-row">
                        <h3 className = "text-center mt-2">個股推薦資料輸入</h3>

                        <div className = "form-row px-5">
                            <div className = "form-group">
                                <label htmlFor = "stock_num_name">股票代號&名稱</label>
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

                        <div className = "form-row px-5 pt-4">
                            <div className = "form-group">
                                <label htmlFor = "date">日期</label>
                                <input type = "text" className = "form-control" id = "date" value = { Today.getFullYear() + "_" + Today.getMonth() + "_" + Today.getDate() } disabled style = {{ opacity : 0.8 }}/>
                            </div>
                        </div>

                        <div className = "form-row px-5 pt-4">
                            <div className = "form-group">
                                <label htmlFor = "username">使用者</label>
                                <input type = "text" className = "form-control" id = "username" value = { username } disabled style = {{ opacity : 0.8 }}/>
                            </div>
                        </div>

                        <div className = "form-row px-5 pt-4">
                            <div className = "form-group">
                                <label htmlFor = "username">評價</label>

                                <select className = "form-select" onChange = { event => setInput2(event.target.value) }>
                                    <option value = "" defaultValue>請選擇評價</option>
                                    <option value = "買進">買進</option>
                                    <option value = "中立">中立</option>
                                    <option value = "賣出">賣出</option>
                                </select>
                            </div>
                        </div>

                        <div className = "form-row px-5 pt-4">
                            <div className = "form-group">
                                <label htmlFor = "targetPrice">目標價</label>
                                <input type = "text" className = "form-control" id = "targetPrice" placeholder = '請輸入預估價位' onChange = { event => setInput3(event.target.value) }/>
                            </div>
                        </div>

                        <div className = "form-row px-5 pt-4">
                            <div className = "form-group">
                                <label htmlFor = "reason">理由</label>
                                <textarea type = "text" className = "form-control" id = "reason" placeholder = '請輸入理由' onChange = { event => setInput4(event.target.value) } style = {{ resize : 'none' }}/>
                            </div>
                        </div>

                        <div className = "form-row px-5 pt-4">
                            <div className = "form-group">
                                <label htmlFor = "upload">檔案上傳(Optional)</label>
                                <input type = "file" className = "form-control" id = "upload" onChange = { event => setInput5(event.target.value) }/>
                            </div>
                        </div>

                        <div className = "px-5 pt-4">
                            <button id = "registerButton" type = "submit" className = "btn btn-primary">Submit</button>
                        </div>
                    </div>
            </form>
        </>
    );
}

export default InputBlockComp;