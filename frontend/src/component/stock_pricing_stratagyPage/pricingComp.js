import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

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
            <div className = 'card h-100' style = {{ minHeight : "200px" }}>
                <div className = 'card-body'>
                    <h3 className = 'card-title'>{ props.pricingName }</h3>
                    <div className = 'row' style = {{ minHeight : "100px" }}>
                        <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain1"] }</h6>
                        <br/>
                        <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain2"] }</h6>
                    </div>

                    <ul className = "list-group list-group-flush text-center">
                        <li className = "list-group-item list-group-item-warning">{ props.pricingExplain["explain3"] }{ props.lowPrice }</li>
                        <li className = "list-group-item list-group-item-success">{ props.pricingExplain["explain4"] }{ props.resonablePrice }</li>
                        <li className = "list-group-item list-group-item-danger">{ props.pricingExplain["explain5"] }{ props.highPrice }</li>
                    </ul>

                    { (props.NewPrice === 0) && <br/> }
                    { (props.NewPrice !== 0 && props.NewPrice - props.lowPrice < 0) && <><br/> <div className = 'card-title'>評價: 最新價格 ＜ 便宜價</div></> }
                    { (props.NewPrice !== 0 && props.NewPrice - props.lowPrice >= 0  && props.NewPrice - props.resonablePrice < 0) && <><br/> <div className = 'card-title'>評價: 便宜價 ＜ 最新價格 ＜ 合理價</div></> }
                    { (props.NewPrice !== 0 && props.NewPrice - props.resonablePrice >= 0  && props.NewPrice - props.highPrice < 0) && <><br/> <div className = 'card-title'>評價: 合理價 ＜ 最新價格 ＜ 昂貴價</div></> }
                    { (props.NewPrice !== 0 && props.NewPrice - props.highPrice >= 0 ) && <><br/> <div className = 'card-title'>評價: 最新價格 ＞昂貴價</div></> }

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
        </>
    );
}

export default PricingComp;