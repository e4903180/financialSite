import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../constant';
import Alert from '@mui/material/Alert';

function RegisterItem() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [nameError, setNameError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmpasswordError, setConfirmpasswordError] = useState(false);
    const [result, setResult] = useState({
        "success" : false,
        "failure" : false
    })

    function nameChangeHandle(name){
        if(name.length > 20){
            setNameError(true)
        }else{
            setName(name)
            setNameError(false)
        }
    }

    function usernameChangeHandle(username){
        if(username.length > 20){
            setUsernameError(true)
        }else{
            setUsername(username)
            setUsernameError(false)
        }
    }

    function emailChangeHandle(email){
        var pattern = new RegExp(/^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{3,6})$/);//eslint-disable-line

        if(pattern.test(email)){
            setEmail(email)
            setEmailError(false)
        }else{
            setEmailError(true)
        };
    };

    function passwordChangeHandle(password){
        var pattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/);//eslint-disable-line

        if(pattern.test(password)){
            if(password !== confirmPassword){
                setConfirmpasswordError(true)
            }else{
                setConfirmpasswordError(false)
            };
            setPassword(password)
            setPasswordError(false)
        }else{
            setPasswordError(true)
        };
    };

    function confirmPasswordChangeHandle(confirmPassword){
        if(confirmPassword !== password){
            setConfirmpasswordError(true)
        }else{
            setConfirmPassword(confirmPassword)
            setConfirmpasswordError(false)
        };
    };

    function submit(e){
        e.preventDefault()
        setResult({
            "success" : false,
            "failure" : false
        })

        if(emailError === false && 
            passwordError === false && 
            confirmpasswordError === false && 
            nameError === false && 
            usernameError === false && 
            name !== "" && 
            username !== "" && 
            email !== "" && 
            password !== "" && 
            confirmPassword !== ""){
            axios.post(config["rootApiIP"] + "/user/register", {
                name : name,
                userName : username,
                email : email,
                password : password
            }).then(res => {
                setResult({
                    "success" : true,
                    "failure" : false
                })
            }).catch(err => {
                setResult({
                    "success" : false,
                    "failure" : true
                })
            });
        }
    }

    return (
        <>
            <form className = "row g-3 needs-validation px-4" onSubmit = { submit } noValidate>
                <div className = "form-row">
                    <h2 className = "text-center display-4">註冊</h2>
                </div>

                { result["success"] ? <div className = 'd-grid py-3'>
                                        <Alert severity="success">註冊成功!</Alert>
                                        </div> : <></>}
                { result["failure"] ? <div className = 'd-grid py-3'>
                                        <Alert severity="error">帳號已經註冊過請重新登入</Alert>
                                        </div> : <></>}

                <div className = "form-row">
                    <p style = {{ color : "red" }}>* 表示必填欄位</p>
                    <div className = "form-group">
                        <label htmlFor = "name">名字 <span style = {{ color : "red" }}>*</span></label>
                        <input type = "text" className = "form-control" id = "name" 
                            onChange = { event => nameChangeHandle(event.target.value) } required/>
                        <div className = "form-text">長度不能超過20字元</div>
                        { nameError ? <div className = "item"> <p style = {{ color : "red" }}>長度超過20個字元</p> </div> : <div></div> }
                    </div>
                </div>

                <div className = "form-row">
                    <div className = "form-group">
                        <label htmlFor = "account">使用者名稱 <span style = {{ color : "red" }}>*</span></label>
                        <input type = "text" className = "form-control" id = "account" 
                            onChange = { event => usernameChangeHandle(event.target.value) } required/>
                        <div className = "form-text">長度不能超過20字元</div>
                        { usernameError ? <div className = "item"> <p style = {{ color : "red" }}>長度超過20個字元</p> </div> : <div></div> }
                    </div>
                </div>

                <div className = "form-row py-1">
                    <div className = "form-group">
                        <label htmlFor = "email">Email <span style = {{ color : "red" }}>*</span></label>
                        <input type = "text" className = "form-control" id = "email" 
                            onChange = { event => emailChangeHandle(event.target.value) } required/>
                        { emailError ? <div className = "item"> <p style = {{ color : "red" }}>Email格式錯誤</p> </div> : <div></div> }
                    </div>
                </div>

                <div className = "form-row">
                    <div className = "form-group">
                        <label htmlFor = "password">密碼 <span style = {{ color : "red" }}>*</span></label>
                        <input type = "password" className = "form-control" id = "password" 
                            onChange = { event => passwordChangeHandle(event.target.value) }/>
                        <div className = "form-text">密碼長度至少6個字元 最多不超過15個</div>
                        <div className = "form-text">密碼必須包含至少一個大寫及小寫</div>
                        { passwordError ? <div className = "item"> <p style = {{ color : "red" }}>密碼格式錯誤</p> </div> : <div></div> }
                    </div>
                </div>

                <div className = "form-row">
                    <div className = "form-group">
                        <label htmlFor = "confirmPassword">確認密碼 <span style = {{ color : "red" }}>*</span></label>
                        <input type = "password" className = "form-control" id = "confirmPassword" 
                            onChange = { event => confirmPasswordChangeHandle(event.target.value) }/>
                        { confirmpasswordError ? <div className = "item"> <p style = {{ color : "red" }}>密碼及確認密碼不相同</p> </div> : <div></div> }
                    </div>
                </div>

                <div className = "d-grid py-3">
                    {
                        emailError === false && 
                        passwordError === false && 
                        confirmpasswordError === false && 
                        nameError === false && 
                        usernameError === false && 
                        name !== "" && 
                        username !== "" && 
                        email !== "" && 
                        password !== "" && 
                        confirmPassword !== "" ? 
                        <button type = "submit" className = "btn btn-primary">註冊</button> : 
                        <button type = "submit" className = "btn btn-primary" disabled>註冊</button>
                    }
                </div>
            </form>
        </>
    );
}

export default RegisterItem;