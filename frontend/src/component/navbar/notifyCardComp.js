import React, { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, Tooltip } from '@mui/material';

function NotifyCardComp(props) {
    const [hover, setHover] = useState(false)
    const [read, setRead] = useState(false)

    useEffect(() => {
        setRead(props.read)
    }, [props.read])

    return (
        <div className = 'card border-0' style = {{ cursor : "pointer", opacity : hover ? 0.7 : 1, color : read ? "gray" : "black" }} onMouseEnter = { () => setHover(true) } onMouseLeave = { () => setHover(false) }>
            <div className = 'row' style = {{ width : "100%" }}>
                <div className = 'col-md-4'>
                    <div className = 'card-body text-center'>
                        <h5 className = 'card-title'>{props.ticker}</h5>
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
                                <IconButton>
                                    <CheckIcon onClick = {() => setRead(false)}/>
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title = "標示為已讀">
                                <IconButton>
                                    <CheckIcon onClick = {() => setRead(true)}/>
                                </IconButton>
                            </Tooltip>
                        }
                    </div> 
                }
            </div>
        </div>
    );
}

export default NotifyCardComp;