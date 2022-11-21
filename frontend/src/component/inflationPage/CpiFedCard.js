import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { rootApiIP } from '../../constant';
import HighchartStockComp from '../highchart/highchatStockComp';
import { inflationInit } from './inflationInit';

function CpiFedCard() {
    const [loading, setLoading] = useState(true)

    const [options1, setOptions1] = useState({
        yAxis: [{
            height: '80%',
        }, {
            top: '80%',
            height: '20%',
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
            selected: 5
        },
        plotOptions : {
            series : {
                dataGrouping : {
                    enabled : false
                }
            }
        }
    });

    const [options2, setOptions2] = useState({
        yAxis: [{
            height: '80%',
        }, {
            top: '80%',
            height: '20%',
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
            selected: 5
        },
        plotOptions : {
            series : {
                dataGrouping : {
                    enabled : false
                }
            }
        }
    });

    const [options3, setOptions3] = useState({
        yAxis: [{
            height: '80%',
        }, {
            top: '80%',
            height: '20%',
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
                buttons : [ 'indicators', 'separator', 'simpleShapes', 'lines', 'crookedLines', 'measure', 'advanced',
                'toggleAnnotations', 'separator', 'verticalLabels', 'flags', 'separator', 'zoomChange', 'fullScreen',
                'typeChange', 'separator', 'currentPriceIndicator', 'saveChart' ]
            }
        },
        tooltip: {
            valueDecimals: 2
        },
        rangeSelector : {
            selected: 1
        },
        plotOptions : {
            series : {
                dataGrouping : {
                    enabled : false
                }
            }
        }
    });

    const [options4, setOptions4] = useState({
        yAxis: [{
            height: '80%',
        }, {
            top: '80%',
            height: '20%',
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
                buttons : [ 'indicators', 'separator', 'simpleShapes', 'lines', 'crookedLines', 'measure', 'advanced',
                'toggleAnnotations', 'separator', 'verticalLabels', 'flags', 'separator', 'zoomChange', 'fullScreen',
                'typeChange', 'separator', 'currentPriceIndicator', 'saveChart' ]
            }
        },
        tooltip: {
            valueDecimals: 2
        },
        rangeSelector : {
            selected: 1
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
        axios.get(rootApiIP + "/data/cpi_fed")
        .then((res) => {
            setOptions1({
                series : [
                    {
                        name : "CPI",
                        id: 'CPI',
                        data : res.data["CPI"]
                    },
                    {
                        name : "FED",
                        id: 'FED',
                        data : res.data["FED"]
                    },
                ],
            })

            setOptions2({
                series : [
                    {
                        name : "AHE",
                        id: 'AHE',
                        data : res.data["AHE"]
                    },
                    {
                        type : "arearange",
                        name : "normal threshold",
                        id : "normal_threshold",
                        data : res.data["AHERangeData"],
                        color : "#ABFFFF",
                        marker : {
                            enabled : false
                        }
                    }
                ],
            })

            setOptions3({
                series : [
                    {
                        name : "DXY",
                        id: 'DXY',
                        data : res.data["DXY"]
                    },
                ],
            })

            setOptions4({
                series : [
                    {
                        name : "JNK",
                        id: 'JNK',
                        data : res.data["JNK"]
                    },
                ],
            })

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

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-10 mx-auto'>
                    <div className = 'card h-100'>
                        <div className = "card-header text-center">
                            CPI (物價通貨膨脹指數 相較去年同月百分比) vs FED (聯邦基金利率 百分比)
                        </div>

                        <div className = 'card-body'>
                            <p className = "card-text">{inflationInit["cpi_fed_explain"]["explain0"]}</p>
                            <p className = "card-text">{inflationInit["cpi_fed_explain"]["explain1"]}</p>
                            <p className = "card-text">&emsp;&emsp;{inflationInit["cpi_fed_explain"]["explain2"]}</p>
                            <p className = "card-text">&emsp;&emsp;{inflationInit["cpi_fed_explain"]["explain3"]}</p>
                            <p className = "card-text">&emsp;&emsp;{inflationInit["cpi_fed_explain"]["explain4"]}</p>
                            <p className = "card-text text-center">{inflationInit["cpi_fed_explain"]["explain5"]}</p>
                            <p className = "card-text text-center">{inflationInit["cpi_fed_explain"]["explain6"]}</p>

                            <HighchartStockComp options = {options1} />
                        </div>
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-4 mx-auto'>
                    <div className = 'card h-100'>
                        <div className = "card-header text-center">
                            Average Hourly Earnings
                            <br/>
                            (美國每小時薪資成長率 相較去年同月百分比)
                        </div>

                        <div className = 'card-body'>
                            <p className = "card-text">{inflationInit["AHE_explain"]["explain0"]}</p>
                            <p className = "card-text">{inflationInit["AHE_explain"]["explain1"]}</p>
                            <HighchartStockComp options = {options2} />
                        </div>
                    </div>
                </div>

                <div className = 'col-md-4 mx-auto'>
                    <div className = 'card h-100'>
                        <div className = "card-header text-center">
                            美元指數(DXY)
                        </div>

                        <div className = 'card-body'>
                            <p className = "card-text">{inflationInit["DXY_explain"]["explain0"]}</p>
                            <p className = "card-text">{inflationInit["DXY_explain"]["explain1"]}</p>
                            <p className = "card-text">{inflationInit["DXY_explain"]["explain2"]}</p>
                            <p className = "card-text">&emsp;&emsp;{inflationInit["DXY_explain"]["explain3"]}</p>
                            <p className = "card-text">&emsp;&emsp;{inflationInit["DXY_explain"]["explain4"]}</p>
                            <p className = "card-text">&emsp;&emsp;{inflationInit["DXY_explain"]["explain5"]}</p>
                            <HighchartStockComp options = {options3} />
                        </div>
                    </div>
                </div>

                <div className = 'col-md-4 mx-auto'>
                    <div className = 'card h-100'>
                        <div className = "card-header text-center">
                            垃圾債(JNK)
                        </div>

                        <div className = 'card-body'>
                            <p className = "card-text">{inflationInit["JNK_explain"]["explain0"]}</p>
                            <p className = "card-text">{inflationInit["JNK_explain"]["explain1"]}</p>
                            <HighchartStockComp options = {options4} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CpiFedCard;