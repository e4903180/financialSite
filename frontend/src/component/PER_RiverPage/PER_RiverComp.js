import { Backdrop, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import PerRiverComp from './PerRiverComp';
import { PerRiverExplain, PerRiverInit } from './PER_River_Init';
import { rootApiIP } from '../../constant'
import { AutoCom } from '../../autoCom';
import axios from 'axios';
import HighchartBarComp from '../highchart/highchartBarComp';
import HighchartStockComp from '../highchart/highchatStockComp';
import TickerSearchComp from '../tickerSearchComp';

function PERRiverComp() {
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [content, setContent] = useState(PerRiverInit);
    const [label, setLabel] = useState(["0x", "0x", "0x"]);
    const [ticker, setTicker] = useState("")

    const optionsBarChart = {
        chart: {
            type: 'bar',
            height : 300
        },
        title: {
            text: '本益比河流圖結果'
        },
        accessibility: {
            enabled: false
        },
        xAxis: {
            categories: ['本益比河流圖']
        },
        yAxis: {
            title: {
                text: '價格區間'
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
            },
        },
        tooltip: {
            formatter: function() {
                if(this.point.hasOwnProperty("stackY") && this.color === "red" && this.point.stackY !== this.y){
                    let offset = this.point.stackY - this.y
                    return this.series.name + ': <b>'+ offset.toFixed(2) + '以上</b>';
                }

                if(this.point.hasOwnProperty("stackY") && this.color !== "black"){
                    let offset = this.point.stackY - this.y
                    return this.series.name + ': From <b>'+ offset.toFixed(2) + '</b> to <b>' + this.point.stackY.toFixed(2) + '</b>';
                }else if(!this.point.hasOwnProperty("stackY") && this.color !== "black"){
                    return "<b>資料尚未載入</b>";
                }else{
                    return this.series.name + "<b>: </b>" + this.y.toFixed(2);
                }
            }
        },
        series: [
            {
                name: '昂貴價區間',
                data: content["up_expensive"],
                color: "red",
            },
            {
                name: '合理到昂貴價區間',
                data: content["reasonable_expensive"],
                color: "#FF5353",
            },
            {
                name: '便宜到合理價區間',
                data: content["cheap_reasonable"],
                color: "#59FF59"
            },
            {
                name: '便宜價區間',
                data: content["down_cheap"],
                color: "#FFFF4F"
            },
            {
                name: '最新價格',
                type: "line",
                data: [content["NewPrice"]],
                color: "black",
                lineWidth : 4
            }
        ]
    }

    const [optionsStockChart, setOptionsStockChart] = useState({
        xAxis: {
            type : "datetime",
            labels : {
                // format : '{value:%Y-%m}'
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

    const autocom = AutoCom.AutoComList;

    function submit(e){
        e.preventDefault();
        setLoading(true);

        if((autocom.map(element => element.stock_num_name).includes(ticker))){
            setInputError(false)

            axios.get(rootApiIP + "/data/PER_River", {
                params : {
                    "stockNum" : ticker.split(" ")[0],
                }
            })
            .then(res => {
                setContent(res.data)
                setLabel([res.data["PER_rate"][0], res.data["PER_rate"][2], res.data["PER_rate"][4]])

                setOptionsStockChart({
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
                        },
                        {
                            name : res.data["PER_rate"][5],
                            data : res.data["data6"]
                        }
                    ]
                })

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
                            <TickerSearchComp init = "" setTicker = {setTicker} />
                        </div>

                        <div className = 'col-md-5 text-center'>
                            <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>搜尋</button>
                        </div>
                    </div>
                </form>
                { inputError ? <p className = 'text-center' style = {{ color : "red" }}>股票代號&名稱格式錯誤</p> : <></> }
            </div>

            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <div className = 'card'>
                        <div className = 'card-body'>
                            <h3 className = 'card-title'>最新價格: { content["NewPrice"] }</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <HighchartBarComp options = { optionsBarChart }/>
                    <HighchartStockComp options = { optionsStockChart } />
                </div>
            </div>
            
            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-8 mx-auto'>
                    <PerRiverComp
                        pricingName = "本益比河流圖"
                        options = { optionsStockChart }
                        pricingExplain = { PerRiverExplain }
                        content = { content }
                        label = { label }
                        cardKey = "PER_river"
                    />
                </div>
            </div>
        </>
    );
}

export default PERRiverComp;