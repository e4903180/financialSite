import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgimage from "../../image/coins_on_chart.jpg"
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { rootApiIP } from '../../constant'
import { columns1 } from '../column/column'

function HomeComp() {
    let [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    // const [realTimePrice, setRealTimePrice] = useState([0.0, 0.0, 0.0])
    // const socket = useContext(WSContext);

    // const HandleRealTimePrice = useCallback((arg) => {
    //     setRealTimePrice(arg["RealTimePrice"])
    // }, [])

    // useEffect(() => {
    //     axios.get(rootApiIP + "/data/realtime_price", {
    //         params : {
    //             "tickerList" : ["2330", "2881", "2603"]
    //         }
    //     })
    //     .then((res) => {
    //         setRealTimePrice(res.data["RealTimePrice"])
    //     }).catch((res) => {
    //         if(res.response.data === "Session expired") window.location.reload()
    //     })
    // }, [])

    useEffect(() => {
        axios.get(rootApiIP + "/data/newest15")
        .then(res => {
            setData(res.data);
        }).catch(res => {
            if(res.response.data === "Session expired") window.location.reload()
        })
    }, [])

    // useEffect(() => {
    //     if(socket){
    //         socket.emit("REQUEST_REAL_TIME_PRICE", { args : ["2330", "2881", "2603"] });
    //         socket.on("REGISTER_REAL_TIME_PRICE", (arg) => HandleRealTimePrice(arg));
    //     }
    // }, [socket])

    return (
        <>
            <div className = 'jumbotron jumbotron-fluid d-flex' style = {{ backgroundImage : `url(${bgimage})`, opacity : "0.8", backgroundAttachment : "fixed", backgroundSize : "cover", height : "60vh", justifyContent : "center", alignItems : "center" }}>
                <div className = 'text-center'>
                    <h1 className = "display-4" style = {{ color : "white" }}>Financial Database</h1>
                    <p className = 'lead' style = {{ color : "white" }}>Easily and quickly</p>
                </div>
            </div>

            {/* <div className = 'row mx-auto'>
                <div className = 'col-md-6 mx-auto'>
                    <h3 className = "display-4 text-center">即時價格</h3>

                    <table className = "table table-striped">
                        <thead>
                            <tr>
                                <th scope = "col">股票代號</th>
                                <th scope = "col">即時價格</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th scope = "row">2330</th>
                                <td>{realTimePrice[0]}</td>
                            </tr>
                            <tr>
                                <th scope = "row">2881</th>
                                <td>{realTimePrice[1]}</td>
                            </tr>

                            <tr>
                                <th scope = "row">2603</th>
                                <td>{realTimePrice[2]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> */}

            <div className = 'container-fluid'>
                <div className = 'col-md-10 mx-auto py-3'>
                    <h3 className = "display-5 text-center">最新15筆個股研究資料</h3>
                    <DataGrid
                        columns = { columns1 } 
                        rows = { data }
                        pageSize = { pageSize }
                        onPageSizeChange={ (newPageSize) => setPageSize(newPageSize) }
                        rowsPerPageOptions = {[5, 10, 20]}
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
                    />
                </div>
            </div>
        </>
    );
}

export default HomeComp;