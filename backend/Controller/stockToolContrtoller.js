let { PythonShell } = require('python-shell')
const { config } = require('../constant')
const { default: axios } = require('axios')

exports.pricingData = async function(req, res){  
    /*
        #swagger.tags = ['Python tool']
        #swagger.description = 'Pricing strategy.'

        #swagger.parameters['stockNum'] = {
            in: 'query',
            description: 'Stock number.',
            required: true,
            type: 'string',
            schema: "2330"
        }

        #swagger.parameters['year'] = {
            in: 'query',
            description: 'Pricing strategy parameter.',
            required: true,
            type: 'string',
            schema: "10"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */  
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
    /*
        #swagger.tags = ['Python tool']
        #swagger.description = 'Per river strategy.'

        #swagger.parameters['stockNum'] = {
            in: 'query',
            description: 'Per river parameter.',
            required: true,
            type: 'string',
            schema: "2330"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
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
    /*
        #swagger.tags = ['Python tool']
        #swagger.description = 'Support resistance strategy.'

        #swagger.parameters['stockNum'] = {
            in: 'query',
            description: 'Support resistance parameter.',
            required: true,
            type: 'string',
            schema: "2330"
        }

        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Support resistance parameter.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['ma_type'] = {
            in: 'query',
            description: 'Support resistance parameter.',
            required: true,
            type: 'string',
            schema: "wma"
        }

        #swagger.parameters['maLen'] = {
            in: 'query',
            description: 'Support resistance parameter.',
            required: true,
            type: 'string',
            schema: "20"
        }

        #swagger.parameters['method'] = {
            in: 'query',
            description: 'Support resistance parameter.',
            required: true,
            type: 'string',
            schema: "method1"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
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

exports.inflation = async function(req, res){
    /*
        #swagger.tags = ['Python tool']
        #swagger.description = 'Inflation.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
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
    /*
        #swagger.tags = ['Python tool']
        #swagger.description = 'Top ticker analysis.'

        #swagger.parameters['start_date'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "2023-01-01"
        }

        #swagger.parameters['end_date'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "2023-04-20"
        }

        #swagger.parameters['top'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "10"
        }

        #swagger.parameters['recommend'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.parameters['category'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.parameters['type'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.parameters['th'] = {
            in: 'query',
            description: 'Top ticker parameter.',
            required: true,
            type: 'string',
            schema: "all"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/top_ticker", {
            params : {
                "start_date" : req.query.start_date,
                "end_date" : req.query.end_date,
                "top" : req.query.top,
                "recommend" : req.query.recommend,
                "category" : req.query.category,
                "type" : req.query.type,
                "th" : req.query.th
            }
        })
    } catch (error) {
        return res.status(400).send(error)
    }

    return res.status(200).send(result.data)
}

exports.twse_financialData = async function(req, res){
    /*
        #swagger.tags = ['Python tool']
        #swagger.description = 'Search calender with financialData recommend.'

        #swagger.parameters['startDateTwse'] = {
            in: 'query',
            description: 'Twse start date.',
            required: true,
            type: 'string',
            schema: "2023-07-01",
        }

        #swagger.parameters['endDateTwse'] = {
            in: 'query',
            description: 'Twse end date.',
            required: true,
            type: 'string',
            schema:"2023-07-18",
        }

        #swagger.parameters['startDateResearch'] = {
            in: 'query',
            description: 'FinancialData start date.',
            required: true,
            type: 'string',
            schema: "2023-07-01",
        }

        #swagger.parameters['endDateResearch'] = {
            in: 'query',
            description: 'FinancialData end date.',
            required: true,
            type: 'string',
            schema: "2023-07-18",
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */

    try {
        result = await axios.get(config["DJANGO_REST_IP"] + "/twse_financial_data", {
            params : {
                "start_date_twse" : req.query.startDateTwse,
                "end_date_twse" : req.query.endDateTwse,
                "start_date_research" : req.query.startDateResearch,
                "end_date_research" : req.query.endDateResearch,
            }
        })
    } catch (error) {
        return res.status(400).send(error)
    }
    
    return res.status(200).send(result.data)
}