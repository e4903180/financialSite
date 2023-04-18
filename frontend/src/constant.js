import { createContext } from "react"

const dev = {
    rootApiIP : "http://140.116.214.154:3000/api",
    WebSocketIP : "http://140.116.214.154:3000?username=",
    rootPathPrefix : ""
}

const prod = {
    rootApiIP : "http://cosbi5.ee.ncku.edu.tw/api",
    WebSocketIP : "http://cosbi5.ee.ncku.edu.tw/?username=",
    rootPathPrefix : "/financial"
}

export const config = process.env.NODE_ENV === "development" ? dev : prod

export const investment_company = [
    "全部", "元富", "統一投顧", "CTBC", "國票投顧", "台新投顧", "富邦", "元大",
    "第一金", "兆豐", "永豐投顧", "宏遠", "康和", "群益", "國泰", "MS",
    "玉山投顧", "福邦", "GS", "Daiwa", "HSBC", "瑞信", "摩根大通", "citi",
    "NMR", "麥格理", "NMR", "ubs", "凱基", "合庫", "jpm", "大和國泰",
    "KGI", "capital", "里昂", "一銀", "HTI", "MR", "dw", "野村",
    "華南", "高盛"
]

export const WSContext = createContext()

export const baseAna = [{method: "股票定價策略", url : config["rootPathPrefix"] + "/stock_pricing_stratagy"},
                        {method: "本益比河流圖", url : config["rootPathPrefix"] + "/PER_River"},
                        {method: "通膨分析", url : config["rootPathPrefix"] + "/inflation"},
                        {method: "CPI, PPI, PCE, 密大指數", url : config["rootPathPrefix"] + "/cpi_ppi_pce"}]
export const techAna = [{method: "天花板地板線", url : config["rootPathPrefix"] + "/support_resistance"}]
export const elseAna = [{method: "熱門個股研究報告", url : config["rootPathPrefix"] + "/top_ticker"},
                        {method: "法說會與投資建議", url : config["rootPathPrefix"] + "/recommend_calender"}]