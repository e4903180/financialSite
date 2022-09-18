import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import PerRiverComp from './PerRiverComp';
import { PerRiverInit } from './PER_River_Explain';
import { rootApiIP } from '../../constant'
import axios from 'axios';

function PERRiverComp() {
    const [Kline, setKline] = useState([]);
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [data5, setData5] = useState([]);
    const [PER_rate, setPER_rate] = useState(["", "", "", "", ""]);

    const [stockNum, setStockNum] = useState([]);
    const [autocom, setAutocom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState(false);

    const options = {
        xAxis: {
            type: "datetime",
            labels: {
                format: '{value:%Y-%m}'
            }
        },
        chart : {
            height : 600
        },
        accessibility: {
            enabled: false
        },
        series: [
            {
                type : 'candlestick',
                name : 'Kline',
                data : Kline,
            },
            {
                name : PER_rate[0],
                data : data1
            },
            {
                name : PER_rate[1],
                data : data2
            },
            {
                name : PER_rate[2],
                data : data3
            },
            {
                name : PER_rate[3],
                data : data4
            },
            {
                name : PER_rate[4],
                data : data5
            }
        ],
        tooltip : {
            shape: 'square',
            shadow: false,
            positioner: function (width, height, point) {
                var chart = this.chart, position;
                
                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            chart.plotLeft,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: point.plotY
                    };
                }else {
                    position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop
                    };
                }
        
                return position;
              }
        }
    }

    useEffect(() => {
        axios.get(rootApiIP + "/data/autoCom")
        .then(res => {
            setAutocom(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    function submit(e){
        e.preventDefault();
        setLoading(true);

        if((autocom.map(element => element.stock_num_name).includes(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value) === true)){
            setInputError(false)

            axios.post(rootApiIP + "/data/Kline", {
                "stockNum" : stockNum[0]["stock_num_name"].slice(0, 4),
            })
            .then(res => {
                if(res.data["error"] !== "Error"){
                    setKline(res.data["data"])
                }else{
                    alert("Limit access")
                }
                setLoading(false)
            }).catch(res => {
                if(res.response.data === "Session expired") window.location.reload()
                setLoading(false)
            })

            axios.post(rootApiIP + "/data/PER_River", {
                "stockNum" : stockNum[0]["stock_num_name"].slice(0, 4),
            })
            .then(res => {
                if(res.data["error"] !== "Error"){
                    setPER_rate(res.data["PER_rate"])
                    setData1(res.data["data1"])
                    setData2(res.data["data2"])
                    setData3(res.data["data3"])
                    setData4(res.data["data4"])
                    setData5(res.data["data5"])
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