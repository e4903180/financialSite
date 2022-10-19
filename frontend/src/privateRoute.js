import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NavbarComp from './component/navbar/navbar';
import axios from "axios";
import { rootApiIP } from './constant';

function PrivateRoute() {
    const [isAuth, setIsAuth] = useState()

    useEffect(() => {
        async function state(){
            await axios.get(rootApiIP + "/data/isAuth")
            .then(res => {
                setIsAuth(true)
            }).catch(res => {
                alert("Session expired, please login again")
                setIsAuth(false)
            })
        }

        state()
    }, [])

    if (isAuth === undefined) return null

    return isAuth ? <div><NavbarComp /> <Outlet /></div> : <Navigate to = "/login" />;
}

export default PrivateRoute;