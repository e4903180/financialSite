import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

function SupportResistanceCard(props) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    return (
        <>
            <div className = 'card h-100'>
                <div className = "card-header">
                    <AiFillCaretDown style = {{ cursor : "pointer" }} data-bs-toggle = "collapse" data-bs-target = {"#" + props.cardKey} aria-expanded = "false" aria-controls = {props.cardKey}/>
                    { props.format } 計算數據
                </div>
            
                <div className = "collapse" id = {props.cardKey}>
                    <div className = 'card-body'>
                        { props.data.length === 0 ? <div className = 'text-center'>確認股票代號後顯示數據</div> : <div className = 'row mx-auto py-2' style = {{height : "500px"}}>
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

export default SupportResistanceCard;