import { Backdrop, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import PerRiverComp from './PerRiverComp';
import { PerRiverInit } from './PER_River_Explain';
import { rootApiIP } from '../../constant'
import { AutoCom } from '../../autoCom';
import axios from 'axios';

function PERRiverComp() {
    const [stockNum, setStockNum] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [options, setOptions] = useState({
        xAxis: {
            type : "datetime",
            labels : {
                format : '{value:%Y-%m}'
            }
        },
        chart : {
            height : 600
        },
        accessibility: {
            enabled : false
        },
        series: [],
        stockTools : {
            gui : {
                buttons : [ 'indicators', 'separator', 'simpleShapes', 'lines', 'crookedLines', 'measure', 'advanced',
                'toggleAnnotations', 'separator', 'verticalLabels', 'flags', 'separator', 'zoomChange', 'fullScreen',
                'typeChange', 'separator', 'currentPriceIndicator', 'saveChart' ]
            }
        }
    });

    const autocom = AutoCom.AutoComList;

    function submit(e){
        e.preventDefault();
        setLoading(true);

        if((autocom.map(element => element.stock_num_name).includes(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value) === true)){
            setInputError(false)

            axios.post(rootApiIP + "/data/PER_River", {
                "stockNum" : stockNum[0]["stock_num_name"].slice(0, 4),
            })
            .then(res => {
                if(res.data["error"] !== "Error"){
                    setOptions({
                        series : [
                            {
                                type : 'candlestick',
                                name : 'Kline',
                                id : 'Kline',
                                data : res.data["Kline"],
                            },
                            {
                                name : res.data["PER_rate"][0],
                                data : res.data["data1"]
                            },
                            {
                                name : res.data["PER_rate"][1],
                                data : res.data["data2"]
                            },
                            {
                                name : res.data["PER_rate"][2],
                                data : res.data["data3"]
                            },
                            {
                                name : res.data["PER_rate"][3],
                                data : res.data["data4"]
                            },
                            {
                                name : res.data["PER_rate"][4],
                                data : res.data["data5"]
                            }
                        ]
                    })
                }
                setLoading(false)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                setLoading(false)
            })
        }else{
            setInputError(true)
            setLoading(false)
        }
    }

    return (
        <>
            <Backdrop
                sx = {{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { loading }
            >
                資料載入中&emsp;
                <CircularProgress color = "inherit" />
            </Backdrop>

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">本益比河流圖</h3>
                
                <form onSubmit = { submit }>
                    <div className = 'form-group row'>
                        <label htmlFor = "stockNum_or_Name" className = "col-md-3 col-form-label text-center">股票代號&名稱:&emsp;</label>
                        <div className = 'col-md-3'>
                            <Typeahead
                                id = "stockNum_or_Name"
                                labelKey = "stock_num_name"
                                onChange = { setStockNum }
                                options = { autocom }
                                placeholder = "請輸入股票代號或名稱"
                                selected = { stockNum }
                            />
                        </div>

                        <div className = 'col-md-5 text-center'>
                            <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>搜尋</button>
                        </div>
                    </div>
                </form>
                { inputError ? <p className = 'text-center' style = {{ color : "red" }}>股票代號&名稱格式錯誤</p> : <></> }
            </div>
            
            <div className = 'row mx-auto py-3' style = {{ width : "90%"}}>
                <div className = 'col-md-8 mx-auto'>
                    <PerRiverComp
                        pricingName = "本益比河流圖"
                        options = { options }
                        pricingExplain = { PerRiverInit }
                    />
                </div>
            </div>
        </>
    );
}

export default PERRiverComp;