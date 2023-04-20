const { config } = require('../constant')
const con = require('../Model/connectTwStock')

exports.filter_ticker = async function(req, res){
    let query = 'SELECT ticker_filter.*, ticker_list.stock_num, ticker_list.stock_name, twStock.Open, twStock.High, twStock.Low, twStock.Close, twStock.Volume \
                FROM ticker_filter INNER JOIN twStock ON ticker_filter.ticker_id=twStock.ticker_id INNER JOIN ticker_list ON ticker_filter.ticker_id=ticker_list.ID \
                WHERE 1=1 AND twStock.date="2017-06-30"'
    let conditions = req.query.conditions

    for(let i = 0; i < conditions.length; i++){
        switch(conditions[i]){
            case "5ma突破15ma黃金交叉":
                query += " AND ticker_filter.5ma_15ma_golden_cross=1"
                conditions[i] = "5ma_15ma_golden_cross"
                break
            case "5ma突破15ma死亡交叉":
                query += " AND ticker_filter.5ma_15ma_death_cross=1"
                conditions[i] = "5ma_15ma_death_cross"
                break
            case "5ma突破30ma黃金交叉":
                query += " AND ticker_filter.5ma_30ma_golden_cross=1"
                conditions[i] = "5ma_30ma_golden_cross"
                break
            case "5ma突破30ma死亡交叉":
                query += " AND ticker_filter.5ma_30ma_death_cross=1"
                conditions[i] = "5ma_30ma_death_cross"
                break
            default:
                break
        }
    };
    
    try {
        const [rows, fields] = await con.promise().query(query);

        for(let i = 0; i < rows.length; i++){
            rows[i]["detail"] = `${config["CLIENT_IP"]}/choose_ticker/detail?stock_num=${rows[i]["stock_name"].split(" ")[0]}&conditions=${conditions}`
        };
        res.status(200).send(rows)
    } catch (error) {
        res.status(400).send("error")
    }
}