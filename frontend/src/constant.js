import { createContext } from "react"

const dev = {
    rootApiIP : "http://140.116.214.154:3000/api",
    WebSocketIP : "http://140.116.214.154:3000?username=",
    rootPathPrefix : ""
}

const prod = {
    rootApiIP : "http://140.116.214.134:3000/api",
    WebSocketIP : "http://140.116.214.134:3000?username=",
    rootPathPrefix : "/financial"
}

export const config = process.env.NODE_ENV === "development" ? dev : prod

export const WSContext = createContext()

export const baseAna = [{method: "股票定價策略", url : config["rootPathPrefix"] + "/stock_pricing_stratagy"}, {method: "本益比河流圖", url : config["rootPathPrefix"] + "/PER_River"}]
export const techAna = [{method: "天花板地板線", url : config["rootPathPrefix"] + "/support_resistance"}]
export const elseAna = [{method: "通膨分析", url : config["rootPathPrefix"] + "/inflation"}, {method: "CPI, PPI, PCE, 密大指數", url : config["rootPathPrefix"] + "/cpi_ppi_pce"}]