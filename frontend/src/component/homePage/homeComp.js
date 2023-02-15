import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgimage from "../../image/coins_on_chart.jpg"
import { GridToolbar } from '@mui/x-data-grid';
import { columns1, columns_news } from '../column/column'
import { StripedDataGrid } from '../stripedDataGrid/stripedDataGrid';
import { config } from '../../constant';

function HomeComp() {
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(15);

    const [newsData, setNewsData] = useState([])
    const [newsPageSize, setNewsPageSize] = useState(10)

    useEffect(() => {
        axios.get(config["rootApiIP"] + "/data/newest15")
        .then(res => {
            setData(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })

        axios.get(config["rootApiIP"] + "/data/news")
        .then(res => {
            setNewsData(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    return (
        <>
            <div className = 'jumbotron jumbotron-fluid d-flex' style = {{ backgroundImage : `url(${bgimage})`, 
            opacity : "0.8", backgroundAttachment : "fixed", backgroundSize : "cover", height : "60vh", 
            justifyContent : "center", alignItems : "center" }}>
                <div className = 'text-center'>
                    <h1 className = "display-4" style = {{ color : "white" }}>Financial Database</h1>
                    <p className = 'lead' style = {{ color : "white" }}>Easily and quickly</p>
                </div>
            </div>

            <div className = 'row mx-auto'>
                <div className = 'col-md-10 mx-auto py-3'>
                    <h3 className = "display-5 text-center">最新新聞</h3>
                    <StripedDataGrid
                        columns = { columns_news }
                        rows = { newsData }
                        pageSize = { newsPageSize }
                        onPageSizeChange={ (newPageSize) => setNewsPageSize(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 15, 20]}
                        getRowId = { row => row.ID }
                        components = {{ Toolbar: GridToolbar }}
                        componentsProps = {{ toolbar: { showQuickFilter: true },}}
                        pagination
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

            <div className = 'container-fluid'>
                <div className = 'col-md-10 mx-auto py-3'>
                    <h3 className = "display-5 text-center">最新15筆個股研究資料</h3>
                    <StripedDataGrid
                        columns = { columns1 }
                        rows = { data }
                        pageSize = { pageSize }
                        onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 15, 20]}
                        getRowId = { row => row.ID }
                        components = {{ Toolbar: GridToolbar }}
                        componentsProps = {{ toolbar: { showQuickFilter: true },}}
                        pagination
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
        </>
    );
}

export default HomeComp;