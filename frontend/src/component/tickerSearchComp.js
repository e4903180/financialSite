import axios from 'axios';
import React, { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { rootApiIP } from '../constant';

function TickerSearchComp(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const handleSearch = (pattern) => {
        setIsLoading(true);
        
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

                renderMenuItemChildren={(option) => (
                    <>
                        <span>{option.stock_name}</span>
                    </>
                )}

                defaultInputValue = {props.init}
            />
        </>
    );
}

export default TickerSearchComp;