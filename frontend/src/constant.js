import { createContext } from "react"

export const rootApiIP = "http://140.116.214.154:3000/api"
export const WebSocketIP = "http://140.116.214.154:3000?username="
export const WSContext = createContext()

export const baseAna = [{method: "股票定價策略", url : "/stock_pricing_stratagy"}, {method: "本益比河流圖", url : "/PER_River"}]
export const techAna = [{method: "天花板地板線", url : "/support_resistance"}]
export const elseAna = [{method: "通膨分析", url : "/inflation"}, {method: "CPI, PPI, PCE, 密大指數", url : "/cpi_ppi_pce"}]