import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import NotifyCardComp from './notifyCardComp';
import axios from 'axios';
import { config } from '../../constant';

function NavbarNotifyComp() {
    const [allRead, setAllRead] = useState("all")
    const [notifyList, setNotifyList] = useState([])

    function handleAll(){
        if(allRead === "read"){
            setAllRead("all")

            axios.get(config["rootApiIP"] + "/data/all_notify")
            .then((res) => {
                setNotifyList([])
                let temp = []
                
                for(let i = 0; i < res.data.length; i++){

                    temp.push(<NotifyCardComp key = {res.data[i].ID} message = { res.data[i].content } time = {res.data[i].notifyTime} read = {res.data[i].read}/>)
    
                    if(i === res.data.length - 1){
                        setNotifyList(temp)
                    }
                }
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }
    }

    function handleRead(){
        if(allRead === "all"){
            setAllRead("read")

            //update notifyList
            axios.get(config["rootApiIP"] + "/data/readed_notify")
            .then((res) => {
                setNotifyList([])
                let temp = []

                for(let i = 0; i < res.data.length; i++){
                    temp.push(<NotifyCardComp key = {res.data[i].ID} message = { res.data[i].content } time = {res.data[i].notifyTime} read = {res.data[i].read}/>)
    
                    if(i === res.data.length - 1){
                        setNotifyList(temp)
                    }
                }
            })
            .catch((res) => {
                if(res.response.data === "Session expired") window.location.reload()
            })
        }
    }

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/all_notify")
        .then((res) => {
            let temp = []
            
            for(let i = 0; i < res.data.length; i++){
                temp.push(<NotifyCardComp key = {res.data[i].ID} message = { res.data[i].content } time = {res.data[i].notifyTime} read = {res.data[i].read}/>)

                if(i === res.data.length - 1){
                    setNotifyList(temp)
                }
            }
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = "container mx-auto" style = {{ width : "500px" }}>
                <div className = 'row my-auto'>
                    <h2>通知</h2>
                </div>

                <div className = 'row my-auto' style = {{ minHeight : "3vh" }}>
                    { allRead === "all" ? 
                        <div className = 'col-md-3 text-center offset-md-1' style = {{ cursor : "pointer" , border: "1px solid #ADADAD", backgroundColor : "#F0F0F0", userSelect : "none"}} onClick = { () => handleAll() }>
                            全部
                        </div> :

                        <div className = 'col-md-3 text-center offset-md-1' style = {{ cursor : "pointer" , border: "1px solid #ADADAD", userSelect : "none"}} onClick = { () => handleAll() }>
                            全部
                        </div>
                    }

                    { allRead === "read" ? 
                        <div className = 'col-md-3 text-center offset-md-1' style = {{ cursor : "pointer" , border: "1px solid #ADADAD", backgroundColor : "#F0F0F0", userSelect : "none"}} onClick = { () => handleRead() }>
                            已讀
                        </div> :

                        <div className = 'col-md-3 text-center offset-md-1' style = {{ cursor : "pointer" , border: "1px solid #ADADAD", userSelect : "none"}} onClick = { () => handleRead() }>
                            已讀
                        </div>
                    }
                </div>

                <div className = 'row mt-3'>
                    <div className = 'col-md-8'>
                        <h5>先前通知</h5>
                    </div>

                    <div className = 'col-md-4 text-center'>
                        <a href = {config["rootApiIP"] + "/user/all_notify"}>查看全部</a>
                    </div>
                </div>

                <div className = 'row' id = "NotifyList">
                    <List
                        sx = {{
                            width: "500px",
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: "80vh",
                        }}
                    >
                        {notifyList}
                    </List>
                </div>
            </div>
        </>
    );
}

export default NavbarNotifyComp;