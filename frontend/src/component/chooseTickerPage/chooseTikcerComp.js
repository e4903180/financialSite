import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import { tickerList } from '../../tickerList';

function ChooseTickerComp() {
    const [tickerClass, setTickerClass] = useState(tickerList.tickerList[0])
    const [chooseTickerList, setChooseTickerList] = useState([{"ticker" : ""}])
    const [ticker, setTicker] = useState("")

    function submit(e){
        e.preventDefault()
    }

    const handleTickerClass = (e) => {
        setTickerClass(e.target.value)
        setChooseTickerList([])

        axios.post(rootApiIP + "/data/choose_ticker", {
            "class" : e.target.value
        })
        .then((res) => {
            setChooseTickerList(res.data)
            setTicker(res.data[0])
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }

    const handleTicker = (e) => {
        setTicker(e.target.value)
    }

    useEffect(() => {
        axios.post(rootApiIP + "/data/choose_ticker", {
            "class" : tickerClass
        })
        .then((res) => {
            setChooseTickerList(res.data)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">選股</h3>
                
                <form onSubmit = { submit }>
                    <div className = 'form-group row'>
                        <label htmlFor = "ticker_class" className = "col-md-3 col-form-label text-center">產業類別:</label>
                        <div className = 'col-md-3'>
                            <select className = "form-select" id = "ticker_class" onChange = {e => handleTickerClass(e)}>
                                {
                                    tickerList.tickerList.map(function(ele, i){
                                        return <option key = { i } value = { ele }>{ ele }</option>
                                    })
                                }
                            </select>
                        </div>

                        <label htmlFor = "ticker" className = "col-md-3 col-form-label text-center">股票名稱&公司:</label>
                        <div className = 'col-md-3'>
                            <select className = "form-select" id = "ticker" onChange = {e => handleTicker(e)}>
                                {
                                    chooseTickerList.map(function(ele, i){
                                        return <option key = { i } value = { ele.ticker }>{ ele.ticker }</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>

                </form> 
            </div>
        </>
    );
}

export default ChooseTickerComp;