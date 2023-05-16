import React, { useState } from 'react';
import LoginItem from './loginItem';
import RegisterItem from './registerItem';

function LoginComp() {
    const [type, setType] = useState("login")

    return (
        <div className="container-fluid" style={{height: "100vh"}}>
            <div className = 'row h-100'>
                <div className = 'col-md-4 h-100' style = {{backgroundColor : 'black'}}>
                    <div className = 'col-md-10 mx-auto' style={{marginTop: "35vh", color : "white"}}>
                        <h2>Cosbi Financial</h2>
                        <h5>登入以繼續使用</h5>
                    </div>
                </div>
                <div className = "col-md-8 align-self-center">
                    <div className = 'col-md-6 mx-auto'>
                        <ul className = "nav nav-tabs">
                            <li className = "nav-item">
                                <button className = "nav-link active" data-bs-toggle = "tab" onClick = {() => setType("login")}>登入</button>
                            </li>

                            <li className = "nav-item">
                                <button className = "nav-link" data-bs-toggle = "tab" onClick = {() => setType("register")}>註冊</button>
                            </li>

                            <div className = "tab-content">
                                { type === "login" && <LoginItem />}
                                { type === "register" && <RegisterItem />}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComp;