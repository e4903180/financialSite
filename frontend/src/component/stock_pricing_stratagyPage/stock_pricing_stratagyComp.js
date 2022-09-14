import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { rootApiIP } from '../../constant'
import PricingComp from './pricingComp';
import { label, priceInit, pricing1, pricing2, pricing3, pricing4 } from './pricingExplain';
import { columns_dividend, columns_high_low, columns_PBR, columns_PER } from '../column/column';
import { Backdrop, CircularProgress } from '@mui/material';

function StockPricingStratagyComp() {
    const [stockNum, setStockNum] = useState([]);
    const [year, setYear] = useState("?");
    const [autocom, setAutocom] = useState([]);
    const [price, setPrice] = useState(priceInit);
    const [loading, setLoading] = useState(false);
    const [inputError, setInputError] = useState(false);

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

        if((autocom.map(element => element.stock_num_name).includes(document.getElementsByClassName('rbt-input-main form-control rbt-input')[0].value) === true) && (year !== "?")){
            setInputError(false)

            axios.post(rootApiIP + "/data/pricing", {
                "stockNum" : stockNum[0]["stock_num_name"].slice(0, 4),
                "year" : year
            })
            .then(res => {
                setPrice(res.data)
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
                <h3 className = "display-6 text-center">股票定價</h3>
                
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

                        <label htmlFor = "year" className = "col-md-3 col-form-label text-center">歷史幾年資料:</label>
                        <div className = 'col-md-3'>
                            <select id = "year" className = "form-select" onChange = {e => setYear(e.target.value)}>
                                <option value = "">請選擇年份</option>
                                <option value = "1">1</option>
                                <option value = "2">2</option>
                                <option value = "3">3</option>
                                <option value = "4">4</option>
                                <option value = "5">5</option>
                                <option value = "6">6</option>
                                <option value = "7">7</option>
                                <option value = "8">8</option>
                                <option value = "9">9</option>
                                <option value = "10">10</option>
                            </select>
                        </div>
                    </div>

                    <div className = 'form-group row py-3'>
                        <div className = 'col-md-12 text-center'>
                            <button type = "submit" className = "btn btn-primary" style = {{ width : "100px" }}>搜尋</button>
                        </div>
                    </div>
                </form>
                { inputError ? <p className = 'text-center' style = {{ color : "red" }}>股票代號&名稱格式錯誤 或 年份錯誤</p> : <></> }
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <div className = 'card'>
                        <div className = 'card-body'>
                            <h3 className = 'card-title'>最新價格: { price["NewPrice"] }</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <PricingComp
                        pricingName = "股利法" 
                        pricingExplain = { pricing1(year) } 
                        lowPrice = { price["cheap1"] }
                        resonablePrice = { price["reasonable1"] }
                        highPrice = { price["expensive1"] }
                        NewPrice = { price["NewPrice"] }
                        data = { price["dividend_table"]["data"] } 
                        label = { label.label1 }
                        columns = { columns_dividend }
                    />
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <PricingComp
                        pricingName = "高低價法" 
                        pricingExplain = { pricing2(year) } 
                        lowPrice = { price["cheap2"] }
                        resonablePrice = { price["reasonable2"] }
                        highPrice = { price["expensive2"] }
                        NewPrice = { price["NewPrice"] }
                        data = { price["high_low_table"]["data"] } 
                        label = { label.label2 }
                        columns = { columns_high_low }
                    />
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <PricingComp
                        pricingName = "本益比法" 
                        pricingExplain = { pricing3(year) } 
                        lowPrice = { price["cheap3"] }
                        resonablePrice = { price["reasonable3"] }
                        highPrice = { price["expensive3"] }
                        NewPrice = { price["NewPrice"] }
                        data = { price["PER_table"]["data"] } 
                        label = { label.label3 }
                        columns = { columns_PER }
                    />
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-8 mx-auto'>
                    <PricingComp
                        pricingName = "本淨比法" 
                        pricingExplain = { pricing4(year) } 
                        lowPrice = { price["cheap4"] }
                        resonablePrice = { price["reasonable4"] }
                        highPrice = { price["expensive4"] }
                        NewPrice = { price["NewPrice"] }
                        data = { price["PBR_table"]["data"] } 
                        label = { label.label4 }
                        columns = { columns_PBR }
                    />
                </div>
            </div>
        </>
    );
}

export default StockPricingStratagyComp;