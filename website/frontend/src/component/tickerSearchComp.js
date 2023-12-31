import axios from 'axios';
import React, { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { config } from '../constant';

function TickerSearchComp(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (pattern) => {
        setIsLoading(true);
        props.setTicker(pattern)
        
        axios.get(config["rootApiIP"] + "/data/ticker_search", { params : {
            "pattern" : pattern
        }})
        .then((res) => {
            setOptions(res.data);
            setIsLoading(false);
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    };

    return (
        <>
            <AsyncTypeahead
                id = "ticker"
                ref = { props.reference }
                isLoading = { isLoading }
                labelKey = "stock_name"
                onSearch = { handleSearch }
                options = { options }
                placeholder = "搜尋股票代號及名稱"
                minLength = {1}

                renderMenuItemChildren={(option) => (
                    <>
                        <span>{option.stock_name}</span>
                    </>
                )}
                
                onChange = {(e) => {
                    if(e[0]){
                        props.setTicker(e[0]["stock_name"])
                    }else{
                        props.setTicker("")
                    }
                }}

                defaultInputValue = {props.init}
            />
        </>
    );
}

export default TickerSearchComp;