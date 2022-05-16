import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

function LoginComp() {
    const nav = useNavigate()
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login(){
        axios.post("http://140.116.214.154:3000/api/login", {
            userName : userName,
            password : password
        }).then(res => {
            alert("Log in")// eslint-disable-next-line
            nav("/home");
        }).catch(err => {
            alert("Username or password error")// eslint-disable-next-line
        });
    };

    function submit(e){
        e.preventDefault()

        login();
    }

    return (
        <div className = 'container-fluid h-100 d-flex flex-column justify-content-center' >
            <div className = "row justify-content-center">
                <div className = "col-sm-4" style = {{ border : "3px solid black", borderRadius: "10px" }}>
                    <form className = "row g-3 needs-validation" onSubmit = { submit } noValidate>
                        <div className = "col-12">
                            <h2 className = "text-center display-4 mt-2">Welcome</h2>
                        </div>

                        <div className = "col-12">
                            <div className = "form-group mx-5">
                                <label htmlFor = "account">Username</label>
                                <input type = "text" className = "form-control" id = "account" onChange = { event => setUsername(event.target.value) } required/>
                            </div>
                        </div>

                        <div className = "col-12">
                            <div className = "form-group mx-5">
                                <label htmlFor = "password">Password</label>
                                <input type = "password" className = "form-control" id = "password" onChange = { event => setPassword(event.target.value) }/>
                            </div>
                        </div>

                        <div className = "text-center" style = {{ padding : "1rem" }}>
                            <Button type = "submit" className = "btn btn-primary">Login</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComp;