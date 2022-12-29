import axios from 'axios';
import React, { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { rootApiIP } from '../constant';

function TickerSearchComp(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (pattern) => {
        setIsLoading(true);
        props.setTicker(pattern)
        
        axios.post(rootApiIP + "/data/ticker_search", {
            "pattern" : pattern
        })
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
                isLoading = { isLoading }
                labelKey = "stock_name"
                onSearch = { handleSearch }
                options = { options }
                placeholder = "搜尋股票代號及名稱"
                minLength = {3}

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