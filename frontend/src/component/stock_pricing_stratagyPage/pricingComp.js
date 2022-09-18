import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { AiFillCaretDown } from "react-icons/ai";
import "bootstrap/js/src/collapse.js";

function PricingComp(props) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState(props.data);

    useEffect(() => {
        try {
            setRows(JSON.parse(props.data))
        } catch (error) {
            
        }
    }, [props.data])

    return (
        <>
            <div className = 'card h-100'>
                <div className = "card-header">
                    <AiFillCaretDown data-bs-toggle = "collapse"  data-bs-target = {"#" + props.cardKey} aria-expanded = "false" aria-controls = {props.cardKey}/>
                    { props.pricingName } 計算數據
                </div>
            
                <div className = "collapse" id = {props.cardKey}>
                    <div className = 'card-body'>
                        <div className = 'row' style = {{ minHeight : "100px" }}>
                            <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain1"] }</h6>
                            <br/>
                            <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain2"] }</h6>
                        </div>

                        <div className = 'row mx-auto py-2' style = {{height : "450px"}}>
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
                                rows = { rows }
                                page = { page }
                                onPageChange={(newPage) => setPage(newPage)}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PricingComp;