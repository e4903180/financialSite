let { PythonShell } = require('python-shell')
const { config } = require('../constant')
const { default: axios } = require('axios')

exports.pricingData = async function(req, res){    
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/PricingStrategy", {
            params : {
                "stockNum" : req.query.stockNum,
                "year" : req.query.year
            }
        })
    } catch (error) {
        return res.status(400).send(error)
    }

    return res.status(200).send(result.data)
}

exports.PER_river_Data = async function(req, res){    
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/PER_River", {
            params : {
                "stockNum" : req.query.stockNum,
            }
        })
    } catch (error) {
        return res.status(400).send(error)
    }

    return res.status(200).send(result.data)
}


exports.support_resistance_data = async function(req, res){
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/SupportResistanceStrategy", {
            params : {
                "stockNum" : req.query.stockNum,
                "startDate" : req.query.startDate,
                "ma_type" : req.query.ma_type,
                "maLen" : req.query.maLen,
                "method" : req.query.method
            }
        })
    } catch (error) {
        return res.status(400).send(error)
    }

    let temp = []

    for(let i = 0; i < result.data["Kline"].length; i++){
        if(result.data["Kline"][i][1] <= result.data["Kline"][i][4]){
            temp.push({ x : result.data["volume"][i][0], y : result.data["volume"][i][1], color : "red"})
        }else{
            temp.push({ x : result.data["volume"][i][0], y : result.data["volume"][i][1], color : "green"})
        }

        if(i == result.data["Kline"].length - 1){
            result.data["volume"] = temp
            return res.status(200).send(result.data)
        }
    };
}


exports.get_realtime_price = async function(req, res){
    let options = {
        args:[
                req.query.tickerList.toString()
        ]
    }

    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/RealTimePrice.py', options, (err, data) => {
            if (err) reject(err)

            const parsedString = JSON.parse(data)
            return resolve(parsedString);
        })
    })

    return res.status(200).send(result)
}

exports.inflation = async function(req, res){
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/inflation")
    } catch (error) {
        console.log(error) 
        return res.status(400).send(error)
    }

    return res.status(200).send(result.data)
}

exports.cpi_ppi = async function(req, res){
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/cpi_ppi_pce")
    } catch (error) {
        return res.status(400).send(error)
    }

    return res.status(200).send(result.data)
}

exports.top_ticker = async function(req, res){
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/top_ticker", {
            params : {
                "start_date" : req.query.start_date,
                "end_date" : req.query.end_date,
                "top" : req.query.top,
                "recommend" : req.query.recommend,
                "category" : req.query.category,
                "type" : req.query.type,
            }
        })
    } catch (error) {
        return res.status(400).send(error)
    }

    return res.status(200).send(result.data)
}