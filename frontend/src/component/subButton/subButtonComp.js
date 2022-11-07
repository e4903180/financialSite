import React, { useState } from 'react';
import SubSupportResistanceForm from './subSupportResistanceForm';

function SubButtonComp(props) {
    const [subType, setSubType] = useState("");

    function handleClick(e){
        setSubType(e.target.innerHTML)
    };

    return (
        <>
            <div className = "dropdown">
                <button className = "btn btn-danger dropdown-toggle" type = "button" data-bs-toggle = "dropdown" aria-expanded = "false">
                    訂閱 警示
                </button>

                <ul className = "dropdown-menu dropdown-menu-end">
                    <li><button className = "dropdown-item" type = "button" data-bs-toggle = "modal" data-bs-target = "#checkEndTimeModal" onClick = { (e) => handleClick(e) }>網站通知</button></li>
                    <li><button className = "dropdown-item" type = "button" data-bs-toggle = "modal" data-bs-target = "#checkEndTimeModal" onClick = { (e) => handleClick(e) }>Email通知</button></li>
                    <li><button className = "dropdown-item" type = "button" data-bs-toggle = "modal" data-bs-target = "#checkEndTimeModal" onClick = { (e) => handleClick(e) }>Line通知</button></li>
                </ul>
            </div>

            { props.type === "SubSupportResistanceForm" && <SubSupportResistanceForm subType = { subType }/> }
        </>
    );
}

export default SubButtonComp;