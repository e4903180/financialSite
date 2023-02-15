import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import CustomListComp from './customListComp';

function UserListComp() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/api/data/userList")
        .then((res) => {
            setUsers(res.data)
        }).catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])
    
    return (
        <>
            <div className = 'text-center mt-2'>
                <h1 className = "display-5">成員列表</h1>
            </div>

            <div className = 'mx-auto mt-5' style = {{ width : "90vw" }}>
                <CustomListComp data = { users } />
            </div>
        </>
    );
}

export default UserListComp;