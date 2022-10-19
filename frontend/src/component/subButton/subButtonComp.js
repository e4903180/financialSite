import { Alert, Snackbar } from '@mui/material';
import React, { useState } from 'react';

function SubButtonComp(props) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [sub, setSub] = useState(false);
    const [count, setCount] = useState(1)

    function handleClick(e){
        // check if user sub already

        setMessage(e.target.innerHTML)
        setOpen(true)
        if(count === 1){
            setCount(count + 1)
        }else{
            setSub(true)
        }
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    return (
        <>
            <div className = "dropdown">
                <button className = "btn btn-danger dropdown-toggle" type = "button" data-bs-toggle = "dropdown" aria-expanded = "false">
                    訂閱
                </button>

                <ul className = "dropdown-menu dropdown-menu-end">
                    <li><button className = "dropdown-item" type = "button" onClick = { (e) => handleClick(e) }>網站通知</button></li>
                    <li><button className = "dropdown-item" type = "button" onClick = { (e) => handleClick(e) }>Email通知</button></li>
                    <li><button className = "dropdown-item" type = "button" onClick = { (e) => handleClick(e) }>Line通知</button></li>
                </ul>
            </div>

            <Snackbar open = {open} autoHideDuration = { 10000 } onClose = { handleClose }>
                {sub ? 
                    <Alert onClose = { handleClose } severity = "error" sx = {{ width: '100%' }}>
                        已經訂閱過相同參數請再次確認
                    </Alert>
                    :
                    <Alert onClose = { handleClose } severity = "success" sx = {{ width: '100%' }}>
                        {message} 訂閱成功
                    </Alert>
                }
            </Snackbar>
        </>
    );
}

export default SubButtonComp;