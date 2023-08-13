import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { config } from '../../constant';
import HighchartStockComp from '../highchart/highchatStockComp';

function DataCard() {
    const [loading, setLoading] = useState(true)

    const [options, setOptions] = useState({
        yAxis: [{
            title :{
                text : "Percent change from year ago"
            },
            opposite : false
        }, {
            title : {
                text : "TWII Index"
            },
            opposite : false
        }, {
            title : {
                text : "UMCS Index"
            },
            opposite : false
        }],
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
                enabled: false
            }
        },
        tooltip: {
            valueDecimals: 2
        },
        rangeSelector : {
            selected: 4
        },
        plotOptions : {
            series : {
                dataGrouping : {
                    enabled : false
                }
            }
        }
    });

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/cpi_ppi")
        .then((res) => {
            setOptions({
                series : [
                    {
                        name : "CPI",
                        id : 'CPI',
                        data : res.data["CPI"],
                        yAxis : 0
                    },
                    {
                        name : "PPI",
                        id : 'PPI',
                        data : res.data["PPI"],
                        yAxis : 0
                    },
                    {
                        name : "PCE",
                        id : 'PCE',
                        data : res.data["PCE"],
                        yAxis : 0
                    },
                    {
                        name : "實質個人消費支出-商品",
                        id : 'RPCEG',
                        data : res.data["RPCEG"],
                        yAxis : 0
                    },
                    {
                        name : "密大消費者信心指數",
                        id : 'UMCS',
                        data : res.data["UMCS"],
                        yAxis : 2
                    },
                    {
                        name : "加權指數",
                        id :"TWII",
                        data : res.data["TWII"],
                        yAxis : 1
                    }
                ]
            })

            setLoading(false)
        })
        .catch((res) => {
            if(res.response.data === "Session expired") window.location.reload()
            setLoading(false)
        })
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

export default DataCard;