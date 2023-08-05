import { Alert } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../constant';

function LoginItem() {
    const nav = useNavigate()
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false)

    function login(){
        axios.get(config["rootApiIP"] + "/user/login", { params : {
            userName : userName,
            password : password
        }}).then(res => {
            nav(config["rootPathPrefix"] + "/home");
        }).catch(err => {
            setLoginError(true)
        });
    };

    function submit(e){
        e.preventDefault()

        login();
    }

    return (
        <>
            <form className = "row g-3 needs-validation py-3" onSubmit = { submit } noValidate>
                <div className = "form-row">
                    <h2 className = "text-center display-4 mt-2">Welcome</h2>
                </div>

                <div className = "form-row">
                    <div className = "form-group">
                        <label htmlFor = "account">Username</label>
                        <input type = "text" className = "form-control" id = "account" onChange = { event => setUsername(event.target.value) } required/>
                    </div>
                </div>

                <div className = "form-row">
                    <div className = "form-group">
                        <label htmlFor = "password">Password</label>
                        <input type = "password" className = "form-control" id = "password" onChange = { event => setPassword(event.target.value) }/>
                    </div>
                </div>

                <div className = 'form-row'>
                    <hr style = {{ color : "black" }}/>
                </div>

                <div className = 'd-grid'>
                    <button type = "submit" className = "btn btn-primary">登入</button>
                </div>

                {loginError ? <>
                                <div className = 'd-grid'>
                                    <Alert severity="error">帳號或密碼錯誤</Alert>
                                </div></> : <></>}
            </form>
        </>
    );
}

export default LoginItem;