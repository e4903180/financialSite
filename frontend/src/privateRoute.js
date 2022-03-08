import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import NavbarComp from './component/navbar/navbar';

function PrivateRoute() {
    const [isAuth, setIsAuth] = useState(true)

    // useEffect(() => {
    //     async function state(){
    //         await axios.get("/user/profile/is-auth")
    //         .then(res => {
    //             setIsAuth(true)
    //         }).catch(res => {
    //             alert("You don't have auth to access please login again")
    //             setIsAuth(false)
    //         })
    //     }
        
    //     state()
    // }, [])

    if (isAuth === undefined) return null

    return isAuth ? <div><NavbarComp /> <Outlet /></div> : <Navigate to = "/" />;
}

export default PrivateRoute;