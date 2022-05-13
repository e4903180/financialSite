import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NavbarComp from './component/navbar/navbar';
import axios from "axios";

function PrivateRoute() {
    const [isAuth, setIsAuth] = useState(true)

    useEffect(() => {
        async function state(){
            await axios.get("http://140.116.214.154:3000/api/homePage")
            .then(res => {
                setIsAuth(true)
            }).catch(res => {
                alert("You don't have auth to access please login again")
                setIsAuth(false)
            })
        }
        
        state()
    }, [])

    if (isAuth === undefined) return null

    return isAuth ? <div><NavbarComp /> <Outlet /></div> : <Navigate to = "/" />;
}

export default PrivateRoute;