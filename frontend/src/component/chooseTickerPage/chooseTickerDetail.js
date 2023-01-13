import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rootApiIP } from '../../constant';
import HighchartStockComp from '../highchart/highchatStockComp';

function ChooseTickerDetail() {
    const scale = {
        0 : [{ "height" : "80%" }, { "top" : "80%", "height" : "20%" }],
        1 : [{ "height" : "70%" }, { "top" : "70%", "height" : "15%" }, { "top" : "85%", "height" : "15%" }],
        2 : [{ "height" : "60%" }, { "top" : "60%", "height" : "13%" }, { "top" : "73%", "height" : "13%" }, { "top" : "86%", "height" : "14%" }],
        3 : [{ "height" : "50%" }, { "top" : "50%", "height" : "12%" }, { "top" : "62%", "height" : "12%" }, { "top" : "74%", "height" : "12%" }, { "top" : "86%", "height" : "14%" }]
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const [scaleType, setScaleType] = useState(0)
    const [stockNum, setStockNum] = useState("")
    const [conditions, setConditions] = useState([])
    const [loading, setLoading] = useState(true)

    const [options, setOptions] = useState({
        yAxis: [],
        xAxis: {
            type : "datetime",
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
        },
        tooltip: {
            valueDecimals: 2
        },
        rangeSelector : {
            selected: 0
        },
        plotOptions : {
            series : {
                dataGrouping : {
                    enabled : false
                }
            },
            candlestick: {
                color: 'green',
                upColor: 'red'
            }
        }
    });

    useEffect(() => {
        searchParams.forEach((value, key) => {
            if(key === "stock_num"){
                setStockNum(value)
            }

            if(key === "conditions"){
                let temp = value.split(",")

                temp.forEach((value, index) => {
                    conditions.push(value)

                    setConditions([...conditions])
                    setScaleType(scaleType + 1)
    
                    setOptions({
                        yAxis : scale[scaleType + 1]
                    })
                })
            }
        });

        setLoading(false)
        // axios.get(rootApiIP + "/data/filter_ticker_detail", { 
        //     params : {
        //         "stock_num" : stockNum,
        //         "conditions" : conditions
        //     }
        // })
        // .then((res) => {
        //     setOptions({
        //         series : [
        //             {
        //                 type : 'candlestick',
        //                 name : 'Kline',
        //                 data : res.data["Kline"],
        //             },
        //         ]
        //     })
        // })
        // .catch((res) => {
        //     if(res.response.data === "Session expired") window.location.reload()
        // })
    }, [])

    return (
        <>
            <Backdrop
                sx = {{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open = { loading }
            >
                資料載入中&emsp;
                <CircularProgress color = "inherit" />
            </Backdrop>

            <HighchartStockComp options = {options} />
        </>
    );
}

export default ChooseTickerDetail;