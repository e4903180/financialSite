import React from 'react';

function CustomA(props) {
    return (
        <a href = { props.value } download = { props.value.split("=")[-1]} target = "_blank" rel = "noreferrer noopener">download</a>
    );
}

export default CustomA;