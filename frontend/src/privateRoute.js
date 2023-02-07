import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import NavbarComp from './component/navbar/navbar';
import axios from "axios";
import { rootApiIP, WebSocketIP, WSContext } from './constant';
import socketio from 'socket.io-client'
import { Button, Modal } from 'react-bootstrap';

function PrivateRoute() {
    const [isAuth, setIsAuth] = useState()
    const [ws, setWs] = useState(null)
    const nav = useNavigate()
    const [show, setShow] = useState(false);

    const handleClose =() => {
        setShow(false)
        nav("/login")
    }

    const handleTimeout = () => {
        setShow(true)
        handleLogOut()
    };

    const handleLogOut = () => {
        axios.get(rootApiIP + "/user/logout")
        .then(res => {
            if(ws) ws.disconnect()
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
            setShow(true)
            setWs(null)
        })
    }, [])

    useEffect(() => {
        let timer = setTimeout(() => {
            handleTimeout()
        }, 14.9 * 60 * 1000);

        event.forEach((item, idx) => {
            window.addEventListener(item, () => {
                clearTimeout(timer)

                timer = setTimeout(() => {
                    handleTimeout()
                }, 14.9 * 60 * 1000);
            });
        })
    }, [])

    if (isAuth === undefined) return null

    return(
        <>
            <Modal show = { show }>
                <Modal.Header>
                    <Modal.Title>服務中斷</Modal.Title>
                </Modal.Header>

                <Modal.Body>閒置過久請重新登入</Modal.Body>

                <Modal.Footer>
                    <Button variant = "secondary" onClick = { handleClose }>
                        確定
                    </Button>
                </Modal.Footer>
            </Modal>

            {isAuth ? <WSContext.Provider value = {ws}>
                <NavbarComp /> 
                <Outlet />
            </WSContext.Provider>
            :<></>}
        </> 
    )
}

export default PrivateRoute;