import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import NotifyCardComp from './notifyCardComp';
import { rootApiIP } from '../../constant';

function NavbarNotifyComp(props) {
    const [allRead, setAllRead] = useState("all")
    const [notifyList, setNotifyList] = useState([])
    const [init, setInit] = useState(false)

    function handleAll(){
        if(allRead === "read"){
            setAllRead("all")

            //update notifyList
            let temp1 = []

            for(let i = 0; i < 15; i++){
                temp1.push(
                    <NotifyCardComp ticker = "2330" key = {i} message = "2330穿越地板線" time = {"2022/10/0" + i} read = {false}/>
                )
        
                if(i === 4){
                    setNotifyList(temp1)
                }
            };
        }
    }

    function handleRead(){
        if(allRead === "all"){
            setAllRead("read")
            //update notifyList
            let temp2 = []

            for(let i = 0; i < 15; i++){
                temp2.push(
                    <NotifyCardComp ticker = "2330" key = {i} message = "2330穿越地板線" time = {"2022/09/0" + i} read = {true}/>
                )
        
                if(i === 4){
                    setNotifyList(temp2)
                }
            };
        }
    }

    useEffect(() => {
        if(init === false){
            setInit(true)

            let temp = []

            for(let i = 0; i < 15; i++){
                temp.push(
                    <NotifyCardComp ticker = "2330" key = {i} message = "2330穿越地板線" time = {"2022/10/0" + i} read = {false}/>
                )
        
                if(i === 4){
                    setNotifyList(temp)
                }
            };
        }else{
            if(allRead === "all"){
                handleAll()
            }else{
                handleRead()
            }
        }
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
                        <a href = {rootApiIP + "/user/notify_all"}>查看全部</a>
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