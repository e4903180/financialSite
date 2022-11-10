const con = require('../Model/connectMySQL')
let { PythonShell } = require('python-shell')

exports.pricingData = async function(req, res){
    let options = {
        args:[
                req.body.stockNum,
                req.body.year
            ]
    }
    
    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/StockPriceDecision.py', options, (err, data) => {
            if (err) reject(err)
            const parsedString = JSON.parse(data)
            return resolve(parsedString);
        })
    })

    return res.status(200).send(result)
}

exports.PER_river_Data = async function(req, res){
    let options = {
        args:[
                req.body.stockNum,
                "MONTH"
            ]
    }
    
    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/PER_River.py', options, (err, data) => {
            if (err) reject(err)
            const parsedString = JSON.parse(data)

            if(data["error"]){
                reject(data["error"])
            }else{
                return resolve(parsedString);
            }
        })
    })

    return res.status(200).send(result)
}


exports.support_resistance_data = async function(req, res){
    let options = {
        args:[
                req.body.stockNum,
                req.body.startDate,
                req.body.ma_type,
                req.body.maLen,
                req.body.method,
            ]
    }

    const result = await new Promise((resolve, reject) => {
        PythonShell.run('/home/cosbi/financialSite/backend/PythonTool/SupportResistance.py', options, (err, data) => {
            if (err) reject(err)

            const parsedString = JSON.parse(data)
            return resolve(parsedString);
        })
    })

    return res.status(200).send(result)
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
