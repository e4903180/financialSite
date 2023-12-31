import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { AiFillCaretDown } from "react-icons/ai";

function PricingComp(props) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    return (
        <>
            <div className = 'card h-100'>
                <div className = "card-header">
                    <AiFillCaretDown style = {{ cursor : "pointer" }} data-bs-toggle = "collapse" data-bs-target = {"#" + props.cardKey} aria-expanded = "false" aria-controls = {props.cardKey}/>
                    { props.pricingName } 計算數據
                </div>
            
                <div className = "collapse" id = {props.cardKey}>
                    <div className = 'card-body'>
                        <div className = 'row' style = {{ minHeight : "100px" }}>
                            <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain1"] }</h6>
                            <br/>
                            <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain2"] }</h6>
                        </div>

                        <div className = "alert alert-warning text-center" role = "alert">
                            {props.pricingExplain["explain3"] + props.price_result[0]}
                        </div>

                        <div className = "alert alert-success text-center" role = "alert">
                            {props.pricingExplain["explain4"] + props.price_result[1]}
                        </div>

                        <div className = "alert alert-danger text-center" role = "alert">
                            {props.pricingExplain["explain5"] + props.price_result[2]}
                        </div>
                        
                        { !props.val_lose && props.price_result[3] === 0 && <p className = 'text-center'>確認股票代號後顯示評價</p> }
                        { !props.val_lose && props.price_result[3] !== 0 && props.price_result[3] <= props.price_result[0] && <div className = 'card-text text-center'>評價: 目前價格({props.price_result[3]}) &#60; 便宜價({props.price_result[0]})</div> }
                        { !props.val_lose && props.price_result[3] !== 0 && props.price_result[3] > props.price_result[0] && props.price_result[3] <= props.price_result[1] && <div className = 'card-text text-center'>評價: 合理價({props.price_result[1]}) &#62; 目前價格({props.price_result[3]}) &#62; 便宜價({props.price_result[0]})</div> }
                        { !props.val_lose && props.price_result[3] !== 0 && props.price_result[3] > props.price_result[1] && props.price_result[3] <= props.price_result[2] && <div className = 'card-text text-center'>評價: 昂貴價({props.price_result[2]}) &#62; 目前價格({props.price_result[3]}) &#62; 合理價({props.price_result[1]})</div> }
                        { !props.val_lose && props.price_result[3] !== 0 && props.price_result[3] > props.price_result[2] && <div className = 'card-text text-center'>評價: 目前價格({props.price_result[3]}) &#62; 昂貴價({props.price_result[2]})</div> }
                        { props.val_lose ? <p className = 'text-center' style = {{ color : "red" }}>資料缺值此定價法不適用</p> : <></> }

                        { props.data.length === 0 ? <div className = 'text-center'>確認股票代號後顯示數據</div> : <div className = 'row mx-auto py-2' style = {{height : "450px"}}>
                            <DataGrid
                                sx = {{
                                    "& .label" : {
                                        backgroundColor: '#b9d5ff91'
                                    }
                                }}
                                
                                getCellClassName = {(params) => {
                                    if(props.label.includes(params.field)){
                                        return 'label'
                                    }else{
                                        return ''
                                    }
                                }}
                                
                                columns = { props.columns }
                                rows = { props.data }
                                page = { page }
                                onPageChange = {(newPage) => setPage(newPage)}
                                pageSize = { pageSize }
                                onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                                rowsPerPageOptions = {[5, 10, 20]}
                                getRowId = { row => row.ID }
                                components = {{ Toolbar: GridToolbar }}
                                componentsProps = {{ toolbar: { showQuickFilter: true },}}
                                pagination
                                disableColumnMenu
                                disableColumnSelector
                                disableDensitySelector
                                disableColumnFilter
                                disableSelectionOnClick = { true }
                            />
                        </div>}
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default PricingComp;