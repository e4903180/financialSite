import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { columns_all_table_summary } from '../column/column';
import { config } from '../../constant';
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import { navList } from './navList';
import NewsComp from './newsItem/newsComp';
import CalenderComp from './calendarItem/calendarComp';
import FinancialDataComp from './financialDataItem/financialDataComp';
import FinancialDataOtherComp from './financialDataOtherItem/financialDataOtherComp';
// import FinancialDataIndustryComp from './financialDataIndustryItem/finanicalDataIndustryComp';
import LineMemoComp from './lineMemoItem/lineMemoComp';
import PostBoardComp from './postBoardItem/postBoardComp';

function DatabaseComp() {
    const [tableStatus, setTableStatus] = useState([])
    const [type, setType] = useState("news")

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/table_status")
        .then(res => {
            setTableStatus(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-6 mx-auto py-3'>
                    <h3 className = "display-6 text-center">資料庫總表</h3>

                    <StripedDataGrid
                        columns = { columns_all_table_summary } 
                        rows = { tableStatus }
                        getRowId = { row => row.dbName }
                        rowsPerPageOptions = {[7]}
                        autoHeight
                        disableColumnMenu
                        disableColumnSelector
                        disableDensitySelector
                        disableColumnFilter
                        disableSelectionOnClick = { true }
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                    />
                </div>
            </div>
            
            <div className = 'row mx-auto py-3'>
                <div className = 'col-md-11 mx-auto py-3'>
                    <h3 className = "display-6 text-center">資料庫進階搜尋</h3>

                    <div className = "card p-0 mt-3">
                        <div className = 'mx-3 mt-2'>
                            <ul className = "nav nav-tabs">
                                <li className = "nav-item">
                                    <button className = "nav-link active" data-bs-toggle = "tab" 
                                        onClick = {() => setType(navList[0]["type"])}>{navList[0]["content"]}</button>
                                </li>

                                {
                                    navList.slice(1).map((ele, idx) => {
                                        return <li className = "nav-item" key = {idx}>
                                            <button className = "nav-link" data-bs-toggle = "tab" 
                                                onClick = {() => setType(ele["type"])}>{ele["content"]}</button>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                        
                        <div className = "tab-content">
                            { type === "news" && <NewsComp /> }
                            { type === "calender" && <CalenderComp /> }
                            { type === "financialData" && <FinancialDataComp /> }
                            { type === "financialDataOther" && <FinancialDataOtherComp /> }
                            {/* { type === "financialDataIndustry" && <FinancialDataIndustryComp /> } */}
                            { type === "lineMemo" && <LineMemoComp /> }
                            { type === "postBoardMemo" && <PostBoardComp /> }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DatabaseComp;