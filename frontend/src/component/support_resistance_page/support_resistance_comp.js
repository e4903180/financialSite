import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { AutoCom } from '../../autoCom';
import { rootApiIP } from '../../constant';
import { columns_support_resistance } from '../column/column';
import HighchartStockComp from '../highchart/highchatStockComp';
import SubButtonComp from '../subButton/subButtonComp';
import SupportResistanceCard from './support_resistance_card';
import { formatExplain } from './support_resistance_explain';
import { dataInit, labels } from './support_resistance_param';

function SupportResistanceComp() {
    var Today = new Date();
    let year = Today.getFullYear()
    let month = (Today.getMonth() + 1) - 1
    const date = 1

    const [loading, setLoading] = useState(false);
    const [stockNum, setStockNum] = useState([]);
    const [inputError, setInputError] = useState(false);
    const [startDate, setStartDate] = useState((year - 5).toString() + "-01-01");
    const [method, setMethod] = useState("method1");
    const [data, setData] = useState(dataInit);
    const [maLen, setMaLen] = useState(20);
    const [maType, setMaType] = useState("sma");
    const [overVolume, setOverVolume] = useState(-1);

    if(month === 0){
        year -= 1
        month = 12
    }

    var TodayDate = year.toString() + "-" + month.toString().padStart(2, '0') + "-" + date.toString().padStart(2, '0')

    const [options, setOptions] = useState({
        yAxis: [{
            height: '80%',
        }, {
            top: '80%',
            height: '20%',
        }],
        xAxis: {
            type : "datetime",
            labels : {
                format : '{value:%Y-%m-%d}'
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

    const autocom = AutoCom.AutoComList;

    function submit(e){
        e.preventDefault();
        setLoading(true);
        setOptions({series : []})

        if(autocom.map(element => element.stock_num_name).includes(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value) === true){
            setInputError(false)
            
            axios.post(rootApiIP + "/data/support_resistance", {
                "stockNum" : stockNum[0]["stock_num_name"].slice(0, 4),
                "startDate" : startDate,
                "ma_type" : maType,
                "maLen" : maLen,
                "method" : method
            })
            .then(res => {
                if (method !== "method3"){
                    setOptions({
                        series : [
                            {
                                type : 'candlestick',
                                name : 'Kline',
                                data : res.data["Kline"],
                            },
                            {
                                name : "support",
                                id: 'support',
                                data : res.data["support"]
                            },
                            {
                                name : "resistance",
                                id: 'resistance',
                                data : res.data["resistance"]
                            },
                            {
                                name : maLen + maType,
                                id: maLen + maType,
                                data : res.data["ma"]
                            },
                            {
                                type : "flags",
                                name: "Crossover",
                                data : res.data["annotations_labels"],
                                allowOverlapX : true
                            },
                            {
                                type: 'column',
                                name: 'Volume',
                                data: res.data["volume"],
                                yAxis: 1
                            },
                        ],
                    })
                }else{
                    setOverVolume(-1)
                    setOverVolume(res.data["over"])
                    setOptions({
                        series : [
                            {
                                type : 'candlestick',
                                name : 'Kline',
                                data : res.data["Kline"],
                            },
                            {
                                name : "support1%",
                                id: 'support1',
                                data : res.data["support1"]
                            },
                            {
                                name : "support5%",
                                id: 'support2',
                                data : res.data["support2"]
                            },
                            {
                                name : maLen + maType,
                                id: maLen + maType,
                                data : res.data["ma"]
                            },
                            {
                                type : "flags",
                                name: "Crossover",
                                data : res.data["annotations_labels"]
                            },
                            {
                                type: 'column',
                                name: 'Volume',
                                data: res.data["volume"],
                                yAxis: 1
                            },
                        ],
                        annotations : [{
                            labels : res.data["annotations_labels"]
                        }]
                    })
                };
                
                setData(dataInit)
                setData(res.data)
                setLoading(false)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                setLoading(false)
            })
        }else{
            setInputError(true)
            setLoading(false)
        }
    };

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
                <h3 className = "display-6 text-center">天花板地板線</h3>

                <form onSubmit = { submit }>
                    <div className = 'form-group row'>
                        <label htmlFor = "stockNum_or_Name" className = "col-md-3 col-form-label">股票代號&名稱:&emsp;</label>
                        <div className = 'col-md-4'>
                            <Typeahead
                                id = "stockNum_or_Name"
                                labelKey = "stock_num_name"
                                onChange = { setStockNum }
                                options = { autocom }
                                placeholder = "請輸入股票代號或名稱"
                                selected = { stockNum }
                            />
                        </div>

                        <div className = 'col-md-5 text-end'>
                            <SubButtonComp type = "SubSupportResistanceForm"/>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <label htmlFor = "date1" className = "col-md-3 col-form-label">歷史資料起始日:</label>
                        <div className = 'col-md-3'>
                            <input type = "date" id = "date1" className = "form-control" onChange = {e => setStartDate(e.target.value)} max = { TodayDate } value = { startDate }></input>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <label htmlFor = "maLen" className = "col-md-3 col-form-label">MA長度:</label>
                        <div className = 'col-md-3'>
                            <select id = "maLen" className = "form-select" onChange = {e => {
                                setMaLen(e.target.value)
                                setOverVolume(-1)
                            }}>
                                <option value = "20">20</option>
                                <option value = "30">30</option>
                                <option value = "50">50</option>
                            </select>
                        </div>

                        <label htmlFor = "ma" className = "col-md-3 col-form-label text-center">MA類型:</label>
                        <div className = 'col-md-3'>
                            <select id = "ma" className = "form-select" onChange = {e =>{
                                setMaType(e.target.value)
                                setOverVolume(-1)
                            }}>
                                <option value = "sma">sma</option>
                                <option value = "wma">wma</option>
                            </select>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <label htmlFor = "method" className = "col-md-3 col-form-label">計算方式:</label>
                        <div className = 'col-md-3'>
                            <select id = "method" className = "form-select" onChange = {e => setMethod(e.target.value)}>
                                <option value = "method1">方法一</option>
                                <option value = "method2">方法二</option>
                                <option value = "method3">方法三</option>
                            </select>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <div className = 'col-md-12 text-center'>
                            <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>搜尋</button>
                        </div>
                    </div>
                </form>

                { inputError ? <p className = 'text-center' style = {{ color : "red" }}>股票代號&名稱格式錯誤</p> : <></> }
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <div className = 'card h-100' style = {{ minHeight : "200px" }}>
                        <div className = 'card-body'>
                            <h3 className = 'card-title'>{ formatExplain(maLen, maType)[method]["explain0"] }</h3>
                            <p className = 'card-subtitle' style = {{ color : "red" }}>此計算方式會參考現在最新價格，實際結果以收盤後為準</p>
                            <br/>
                            <div className = 'row' style = {{ minHeight : "100px" }}>
                                <h6 className = "card-subtitle text-muted">{ formatExplain(maLen, maType)[method]["explain1"] }</h6>
                                <h6 className = "card-subtitle text-muted">{ formatExplain(maLen, maType)[method]["explain2"] }</h6>
                                { method === "method3" && overVolume === 1 &&  <div className = "alert alert-success text-center" role = "alert">今日交易量大於 2倍{maLen.toString()}天均量</div>}
                                { method === "method3" && overVolume === 0 &&  <div className = "alert alert-danger text-center" role = "alert">今日交易量小於 2倍{maLen.toString()}天均量</div>}
                                { method === "method3" && overVolume === -1 &&  <div className = "alert alert-warning text-center" role = "alert">尚未計算</div>}
                            </div>
                        </div>

                        <HighchartStockComp options = {options} />
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <SupportResistanceCard data = { data["table_data"]["data"] } columns = { columns_support_resistance } label = { labels["label"] } cardKey = "Kline"/>
                </div>
            </div>
        </>
    );
}

export default SupportResistanceComp;