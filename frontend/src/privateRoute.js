import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavbarComp from './component/navbar/navbar';
import axios from "axios";
import { rootApiIP, WebSocketIP, WSContext } from './constant';
import socketio from 'socket.io-client'

function PrivateRoute() {
    const [isAuth, setIsAuth] = useState()
    const [ws, setWs] = useState(null)
    const nav = useNavigate()

    const handleLogOut = () => {
        axios.get(rootApiIP + "/user/logout")
        .then(res => {
            if(ws) ws.disconnect()
            nav("/login")
        })
    }

    const event = [
        "load",
        "mousemove",
        "mousedown",
        "click",
        "scroll",
        "keypress",
    ];

    useEffect(() => {
        axios.get(rootApiIP + "/data/isAuth")
        .then(res => {
            setIsAuth(true)
            setWs(socketio.connect(WebSocketIP + res.data))
        }).catch(res => {
            setIsAuth(false)
            setWs(null)
            alert("連線逾時請重新登入")
        })
    }, [])

    useEffect(() => {
        let timer = setTimeout(() => {
            handleLogOut()
        }, 14.8 * 60 * 1000);

        event.forEach((item, idx) => {
            window.addEventListener(item, () => {
                clearTimeout(timer)

                timer = setTimeout(() => {
                    handleLogOut()
                }, 14.8 * 60 * 1000);
            });
        })
    }, [])

    if (isAuth === undefined) return null

    return isAuth ? <><WSContext.Provider value = {ws}><NavbarComp /> <Outlet /></WSContext.Provider></> : <Navigate to = "/login" />;
}

export default PrivateRoute;