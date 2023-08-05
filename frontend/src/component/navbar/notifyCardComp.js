import React, { useCallback, useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import { config } from '../../constant';

function NotifyCardComp(props) {
    const [hover, setHover] = useState(false)
    const [read, setRead] = useState(props.read)

    const handleUnreadClick = useCallback((e, time) => {
        e.preventDefault()

        axios.put(config["rootApiIP"] + "/data/notify_handle_unread", {
            time : time
        })
        .then((res) => {
            setRead(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    const handleReadClick = useCallback((e, time) => {
        e.preventDefault()

        axios.put(config["rootApiIP"] + "/data/notify_handle_read", {
            time : time
        })
        .then((res) => {
            setRead(true)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    useEffect(() => {
        setRead(props.read)
    }, [props.read])

    return (
        <div className = 'card border-0' style = {{ cursor : "pointer", opacity : hover ? 0.7 : 1, color : read ? "gray" : "black" }} onMouseEnter = { () => setHover(true) } onMouseLeave = { () => setHover(false) }>
            <div className = 'row mx-auto' style = {{ width : "100%" }}>
                <div className = 'col-md-4'>
                    <div className = 'card-body text-center'>
                        <h5 className = 'card-title'>系統</h5>
                    </div>
                </div>

                <div className = 'col-md-8'>
                    <div className = 'card-body'>
                        <h6 className = "card-text">{props.message}</h6>
                        <p className = "card-subtitle text-muted" style = {{ fontSize : "10px" }}>{props.time}</p>
                    </div>
                </div>

                { hover && 
                    <div className = 'col-md-2 offset-md-10 d-flex align-items-center text-center' style = {{ position : "absolute", zindex : 100, height : "100%" }}>
                        { read ? 
                            <Tooltip title = "標示為未讀">
                                <div className = "icon-wrapper" onClick = { (e) => handleUnreadClick(e, props.time) }>
                                    <IconButton>
                                        <CheckIcon/>
                                    </IconButton>
                                </div>
                            </Tooltip>
                            :
                            <Tooltip title = "標示為已讀">
                                <div className = "icon-wrapper" onClick = { (e) => handleReadClick(e, props.time) }>
                                    <IconButton>
                                        <CheckIcon/>
                                    </IconButton>
                                </div>
                            </Tooltip>
                        }
                    </div> 
                }
            </div>
        </div>
    );
}

export default NotifyCardComp;