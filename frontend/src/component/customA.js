import React from 'react';

function CustomA(props) {
    return (
        <a href = { "http://140.116.214.154:3000/api/data/download/singleFile?filePath=" + props.value } download = { props.value.split("/")[-1]}>download</a>
    );
}

export default CustomA;