export const PerRiverInit = {
    "EPS" : 0,
    "evaluate" : "確認股票代號後顯示評價",
    "NewPrice" : 0,
    "cheap" : 0,
    "reasonable" : 0,
    "expensive" : 0,
    "down_cheap" : [0],
    "cheap_reasonable" : [0],
    "reasonable_expensive" : [0],
    "up_expensive" : [0],
}

export const PerRiverExplain = {
    "explain1" : "將歷史本益比最高到最低區間平分為4份共7個區間, 再分別乘上EPS估算股價",
    "explain2" : `股價 = EPS x 本益比，越接近底部越便宜，反之越貴`,
}