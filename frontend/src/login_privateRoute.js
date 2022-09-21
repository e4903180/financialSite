import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from "axios";
import { rootApiIP } from './constant';

function LoginRoute() {
    const [isAuth, setIsAuth] = useState()

    useEffect(() => {
        async function state(){
            axios.get(rootApiIP + "/data/isAuth")
            .then(res => {
                setIsAuth(true)
            }).catch(res => {
                setIsAuth(false)
            })
        }
        
        state()
    }, [])

    if (isAuth === undefined) return null

    return isAuth ? <Navigate to = "/home" /> : <Outlet />;
}

export default LoginRoute;