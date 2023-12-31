import CustomA from "../customA";
import React from 'react';
import { config } from "../../constant";
import Highlighter from "react-highlight-words";
import { Button } from "@mui/material";
import HighchartBarComp from "../highchart/highchartBarComp";

export const columns_all_table_summary = [
    { field: "dbName", headerName : "資料表名稱", flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'dataQuantity', headerName: '資料總筆數', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'newestDate', headerName: '最新資料日期', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'table', headerName: '資料總表下載', flex: 1, headerAlign: 'center', align: 'center', 
        renderCell : rowData => <a href = { config["rootApiIP"] + `/data/download/table_status?table_name=${rowData.value}.csv` } target = "_blank" rel = "noreferrer noopener" 
    download = { rowData.value + ".csv" }>Download</a> , sortable: false},
];

export const columns_financialData = [
    { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '資料日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'investmentCompany', headerName: '投顧公司', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'recommend', headerName: '投資建議', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'remark', headerName: '備註', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_financialData?filename=" + rowData.value } 
    target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a> },
];

export const columns_post_board_memo = [
    { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'evaluation', headerName: '評價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'price', headerName: '目標價', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'reason', headerName: '理由', headerAlign: 'center', align: 'center', sortable: false, width: 400 },
    { field: 'filename', headerName: '檔案下載', headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : (rowData) => (check_single_post_board_memo_NULL(rowData.value))},
];

export const columns_line_memo = [
    { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => (check_single_lineMemo_memo_NULL(rowData.value)) },
    { field: 'inputTime', headerName: '輸入時間', flex: 1, headerAlign: 'center', align: 'center', sortable: false },
    { field: 'username', headerName: 'Username', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns_twse = [
    { field: 'stock_name', headerName: '股票名稱', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '法說會日期', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'Time', headerName: '法說會時間', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'Form', headerName: '法說會形式', width: 300, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'Message', headerName: '法說會訊息', width: 800, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'chPDF', headerName: '中文檔案', width: 100, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => check_single_twse_chPDF_NULL(rowData.value) },
    { field: 'enPDF', headerName: '英文檔案', width: 100, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => check_single_twse_enPDF_NULL(rowData.value) },
    { field: 'More_information', headerName: '相關資訊', width: 300, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'Video_address', headerName: '影音連結資訊', width: 300, headerAlign: 'center', sortable: false, align: 'center' },
    { field: 'Attention', headerName: '其他應敘明事項', width: 300, headerAlign: 'center', sortable: false, align: 'center'},
];

export const columns_industry_analysis = [
    { field: 'username', headerName: '上傳者', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '上傳日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'title', headerName: '上傳檔案標題', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
    { field: 'fileName', headerName: '上傳檔案名稱', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_industry_analysis?filename=" + rowData.value.replace("%", "percentTransform") } 
    target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a>  },
];

export const columns_meeting_data = [
    { field: 'username', headerName: '上傳者', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '上傳日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'fileName', headerName: '上傳檔案名稱', flex: 1, headerAlign: 'center', sortable: false, align: 'center'},
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_meetingData?filename=" + rowData.value } 
    target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a>  },
];

export const columns_dividend = [
    { field: "ID", headerName : "股利發放年度", flex: 1, headerAlign: 'center', align: 'center' },
    { field: '1', headerName: '現金股利盈餘', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '2', headerName: '現金股利公積', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '3', headerName: '現金股利合計', flex: 1, headerAlign: 'center', align: 'center'},
    { field: '4', headerName: '股票股利盈餘', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '5', headerName: '股票股利公積', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '6', headerName: '股票股利合計', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '7', headerName: '股利合計', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns_high_low = [
    { field: "ID", headerName : "年度", flex: 1, headerAlign: 'center', align: 'center' },
    { field: '1', headerName: '最高', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '2', headerName: '最低', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '3', headerName: '收盤', flex: 1, headerAlign: 'center', align: 'center'},
    { field: '4', headerName: '平均', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns_PER = [
    { field: "ID", headerName : "年度", flex: 1, headerAlign: 'center', align: 'center' },
    { field: '1', headerName: 'EPS(元)', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '2', headerName: '最高PER', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '3', headerName: '最低PER', flex: 1, headerAlign: 'center', align: 'center'},
    { field: '4', headerName: '平均PER', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns_PBR = [
    { field: "ID", headerName : "年度", flex: 1, headerAlign: 'center', align: 'center' },
    { field: '1', headerName: 'BPS(元)', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '2', headerName: '最高PBR', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '3', headerName: '最低PBR', flex: 1, headerAlign: 'center', align: 'center' },
    { field: '4', headerName: '平均PBR', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns_support_resistance = [
    { field: "ID", headerName : "日期", flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Open', headerName: 'Open', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'High', headerName: 'High', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Low', headerName: 'Low', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Close', headerName: 'Close', flex: 1, headerAlign: 'center', align: 'center' },
];

export const columns_choose_ticker = [
    { field: "stock_name", headerName : "股票名稱", flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Open', headerName: 'Open', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'High', headerName: 'High', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Low', headerName: 'Low', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Close', headerName: 'Close', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Volume', headerName: '成交量', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'detail', headerName: '詳細資料', flex: 1, headerAlign: 'center', align: 'center', 
        renderCell : rowData => <a href = { rowData.value } target = "_blank" rel = "noreferrer noopener">詳細資料</a> }
];

export const columns_news = (pattern) => {
    return(
        [
            { field: "date", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
            { field: "category", headerName : "新聞類別", flex: 1, headerAlign: 'center', align: 'center' },
            { field: "title", headerName : "新聞標題", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
                rowData => <a href = { rowData.value[1] } target = "_blank" rel = "noreferrer noopener">
                    <Highlighter
                        highlightStyle={{"backgroundColor" : "yellow"}}
                        searchWords={[pattern]}
                        textToHighlight={rowData.value[0]}
                    />
                </a> },
            { field: 'repoter', headerName: '記者', flex: 1, headerAlign: 'center', align: 'center' },
        ]
    )
}

export const columns_financialDataOther_highlight = (pattern) => {
    return (
        [
            { field: "date", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
            { field: "investmentCompany", headerName : "投顧公司", flex: 1, headerAlign: 'center', align: 'center' },
            { field: "title", headerName : "標題", flex: 1, headerAlign: 'center', align: 'center', renderCell :
                rowData => <>
                    <Highlighter
                        highlightStyle={{"backgroundColor" : "yellow"}}
                        searchWords={[pattern]}
                        textToHighlight={rowData.value}
                    />
                </> },
            { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
                renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_financialDataOther?filename=" + rowData.value } 
            target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a> },
        ]
    )
}

export const columns_statementdog = [
    { field: "date", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "title", headerName : "新聞標題", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
        rowData => <a href = { rowData.value[1] } target = "_blank" rel = "noreferrer noopener">{rowData.value[0]}</a> },
];

export const columns_home_news = [
    { field: "cteeDate", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "cteeTitle", headerName : "工商時報", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
        rowData => <a href = { rowData.value[1] } target = "_blank" rel = "noreferrer noopener">{rowData.value[0]}</a> },
    { field: "moneyDjDate", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "moneyDjTitle", headerName : "MoneyDj", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
        rowData => <a href = { rowData.value[1] } target = "_blank" rel = "noreferrer noopener">{rowData.value[0]}</a> },
    { field: "moneyDate", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "moneyTitle", headerName : "經濟日報", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
        rowData => <a href = { rowData.value[1] } target = "_blank" rel = "noreferrer noopener">{rowData.value[0]}</a> },
    { field: "statementdogDate", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "statementdogTitle", headerName : "財報狗", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
        rowData => <a href = { rowData.value[1] } target = "_blank" rel = "noreferrer noopener">{rowData.value[0]}</a> },
];

export const columns_financialDataOther = [
    { field: "date", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "investmentCompany", headerName : "投顧公司", flex: 1, headerAlign: 'center', align: 'center' },
    { field: "title", headerName : "標題", flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_financialDataOther?filename=" + rowData.value } 
    target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a> },
];

export const columns_financialDataIndustry = [
    { field: "date", headerName : "日期", flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: "investmentCompany", headerName : "投顧公司", flex: 1, headerAlign: 'center', align: 'center' },
    { field: "category", headerName : "產業類別", flex: 1, headerAlign: 'center', align: 'center' },
    { field: "title", headerName : "標題", flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'filename', headerName: '檔案下載', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => <a href = { config["rootApiIP"] + "/data/download/single_financialDataIndustry?filename=" + rowData.value } 
    target = "_blank" rel = "noreferrer noopener" download = { rowData.value }>Download</a> },
];

export const columns_twse_detail = [
    { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: '法說會日期', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'Time', headerName: '法說會時間', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'chPDF', headerName: '中文檔案', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => check_single_twse_chPDF_NULL(rowData.value) },
    { field: 'enPDF', headerName: '英文檔案', flex: 1, headerAlign: 'center', sortable: false, align: 'center', 
        renderCell : rowData => check_single_twse_enPDF_NULL(rowData.value) },
];

export const columns_twse_recommend = (setDetailClick, setDetailColumns, setPageDetail, setDetailData) => {
    return (
        [
            { field: 'stock_name', headerName: '股票名稱', flex: 1, headerAlign: 'center', align: 'center' },
            { field: 'twse', headerName: '法說會資料', flex: 1, headerAlign: 'center', align: 'center', renderCell : rowData =>
                <Button size = "medium" onClick = {() => {
                    setPageDetail(0)
                    setDetailClick(true)
                    setDetailColumns(columns_twse_detail)
                    setDetailData(rowData.row.twse)
                }}>詳細資料</Button> , sortable: false},
            { field: 'financialData', headerName: '個股研究報告資料', flex: 1, headerAlign: 'center', align: 'center', renderCell : rowData => 
                <Button size = "medium" onClick = {() => {
                    setPageDetail(0)
                    setDetailClick(true)
                    setDetailColumns(columns_financialData)
                    setDetailData(rowData.row.financialData)
                }}>詳細資料</Button> , sortable: false},
            { field: 'buy', headerName: '買進', flex: 1, headerAlign: 'center', align: 'center'},
            { field: 'interval', headerName: '區間操作', flex: 1, headerAlign: 'center', align: 'center'},
            { field: 'hold', headerName: '持有', flex: 1, headerAlign: 'center', align: 'center'},
            { field: 'sell', headerName: '賣出', flex: 1, headerAlign: 'center', align: 'center'},
        ]
    )
}

export const columns_popular_ticker = (setLoading, setDetailColumns, setPageDetail, setDetailData) => {
    return (
        [
            { field: "stock_num", headerName : "股票代號", flex: 1, headerAlign: 'center', align: 'center', sortable: false },
            { field: "stock_name", headerName : "股票名稱", flex: 1, headerAlign: 'center', align: 'center', sortable: false },
            { field: "financialDataQuantity", headerName : "個股研究報告數量", flex: 1, headerAlign: 'center', align: 'center', sortable: false, renderCell : rowData => 
                <Button size = "medium" onClick = {() => {
                    setPageDetail(0)
                    setLoading(true)
                    setDetailColumns(columns_financialData)
                    setDetailData(rowData.row.financialData)
                }}>{rowData.row.financialDataQuantity}</Button> },
            { field: "newsQuantity", headerName : "新聞數量", flex: 1, headerAlign: 'center', align: 'center', sortable: false, renderCell : rowData =>
                <Button size = "medium" onClick = {() => {
                    setPageDetail(0)
                    setLoading(true)
                    setDetailColumns(columns_news(rowData.row.stock_name))
                    setDetailData(rowData.row.news)
                }}>{rowData.row.newsQuantity}</Button> },
        ]
    )
}

export const columns_popular_news = [
        { field: "stock_num", headerName : "股票代號", flex: 0.25, headerAlign: 'center', align: 'center', sortable: false },
        { field: "stock_name", headerName : "股票名稱", flex: 0.25, headerAlign: 'center', align: 'center', sortable: false },
        { field: "date", headerName : "日期", flex: 0.25, headerAlign: 'center', align: 'center' },
        { field: "action", headerName : "新聞標題", flex: 1, headerAlign: 'center', align: 'center', renderCell : 
            rowData => <a href = { rowData.row.link } target = "_blank" rel = "noreferrer noopener">
                <Highlighter
                    highlightStyle={{"backgroundColor" : "yellow"}}
                    searchWords={[rowData.row.stock_name]}
                    textToHighlight={rowData.row.title}
                />
            </a> },
    ]

const check_single_post_board_memo_NULL = (value) => {
    if(value === "nan" || value === "NULL" || value === ""){
        return <>沒有檔案</>
    }else{
        return <CustomA value = { config["rootApiIP"] + "/data/download/single_post_board_memo?filename=" + value } />
    }
}

const check_single_lineMemo_memo_NULL = (value) => {
    if(value === "nan" || value === "NULL" || value === ""){
        return <>沒有檔案</>
    }else{
        return <CustomA value = { config["rootApiIP"] + "/data/download/single_line_memo?filename=" + value } />
    }
}

const check_single_twse_chPDF_NULL = (value) => {
    if(value === "nan" || value === "NULL" || value === ""){
        return <> </>
    }else if(value === "內容檔案於當日會後公告於公開資訊觀測站"){
        return value
    }else{
        return <a href = { config["rootApiIP"] + "/data/download/single_twse_chPDF?filename=" + value } 
        target = "_blank" rel = "noreferrer noopener" download = { value }>Download</a>
    }
}

const check_single_twse_enPDF_NULL = (value) => {
    if(value === "nan" || value === "NULL" || value === ""){
        return <> </>
    }else if(value === "內容檔案於當日會後公告於公開資訊觀測站"){
        return value
    }else{
        return <a href = { config["rootApiIP"] + "/data/download/single_twse_enPDF?filename=" + value } 
        target = "_blank" rel = "noreferrer noopener" download = { value }>Download</a>
    }
}