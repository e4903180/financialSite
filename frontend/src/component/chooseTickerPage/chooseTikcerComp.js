import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import { tickerList } from '../../tickerList';
import AnalysisComp from './analysisComp';

function ChooseTickerComp() {
    const [tickerClass, setTickerClass] = useState(tickerList.tickerList[0])

    function submit(e){
        e.preventDefault()
    }

    const handleTickerClass = (e) => {
        setTickerClass(e.target.value)
    }

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
                    </div>
                </form> 
            </div>

            <div className = 'row mx-auto' style = {{ width : "60vw" }}>
                <AnalysisComp />
            </div>
        </>
    );
}

export default ChooseTickerComp;