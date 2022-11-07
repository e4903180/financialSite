export function formatExplain(ma, maType) {
    return(
        {
            "method1" : {
                "explain0": "方法一",
                "explain1" : `天花板線 = 正乖離率由小到大排序後的第95%當作門檻值 * ${ma} ${maType} + ${ma} ${maType}`,
                "explain2" : `地板線 = 負乖離率由小到大排序後的第5%當作門檻值 * ${ma} ${maType} + ${ma} ${maType}`
            },
            "method2" : {
                "explain0": "方法二",
                "explain1" : `地板線 = ${ma} ${maType} - ${ma} ${maType} * (負乖離率平均 - 負乖離率2倍標準差)`,
                "explain2": ""
            },
            "method3" : {
                "explain0": "方法三",
                "explain1" : `地板線 = 負乖離率由小到大排序後的第1%(5%)當作門檻值 * ${ma} ${maType} + ${ma} ${maType}`,
                "explain2": "當天交易量必須大於2倍的20天均量才符合"
            },
        }
    )
}

export const dataInit = {
    "support" : [],
    "resistance" : [],
    "Kline" : [],
    "table_data" : {"data" : []},
    "ma" : []
}

export const labels = {
    "label" : ["Close"],
}