import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginComp() {
    const nav = useNavigate()
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login(){
        axios.post("http://localhost:3000/user/login", {
            userName : userName,
            password : password
        }).then(res => {
            alert("Send edit email")// eslint-disable-next-line
        }).catch(res => {
            alert("error")// eslint-disable-next-line
        });
    };

    function submit(e){
        e.preventDefault()

        login();
    }

    return (
        <div className = 'container h-100 d-flex flex-column justify-content-center' >
            <div className = "row justify-content-center" >
                <div className = "col-md-4" style = {{ border : "3px solid #fff", borderRadius: "10px" }}>
                    <form onSubmit = { submit }>
                        <h2 className = "text-center display-4 mt-2" style = {{ color : "white" }}>Welcome</h2>

                        <div className = "form-group mx-5" style = {{ padding : "1rem" }}>
                            <label htmlFor = "account" style = {{ color : "white" }}>Username</label>
                            <input type = "text" className = "form-control" id = "account" placeholder = "username" onChange = { event => setUsername(event.target.value) }/>
                        </div>

                        <div className = "form-group mx-5" style = {{ padding : "1rem" }}>
                            <label htmlFor = "password" style = {{ color : "white" }}>Password</label>
                            <input type = "password" className = "form-control" id = "password" onChange = { event => setPassword(event.target.value) }/>
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