import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NavbarComp from './component/navbar/navbar';
import axios from "axios";
import { rootApiIP, WebSocketIP, WSContext } from './constant';
import socketio from 'socket.io-client'

function PrivateRoute() {
    const [isAuth, setIsAuth] = useState()
    const [ws, setWs] = useState(null)

    useEffect(() => {
        axios.get(rootApiIP + "/data/isAuth")
        .then(res => {
            setIsAuth(true)
            setWs(socketio.connect(WebSocketIP + res.data))
        }).catch(res => {
            alert("Session expired, please login again")
            setIsAuth(false)
            setWs(null)
        })

    }, [])

    if (isAuth === undefined) return null

    return isAuth ? <><WSContext.Provider value = {ws}><NavbarComp /> <Outlet /></WSContext.Provider></> : <Navigate to = "/login" />;
}

export default PrivateRoute;