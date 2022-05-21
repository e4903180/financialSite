import { Paper, TableContainer } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { CSVLink } from "react-csv";
import React, { useEffect, useState } from 'react';

function DatabaseComp() {
    let [data0, setData0] = useState([]);
    let [data1, setData1] = useState([]);
    let [data2, setData2] = useState([]);

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/allData")
        .then(res => {
            setData0(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "40vw" }}>
                <h3 className = "display-6 text-center">資料庫總表</h3>

                <TableContainer component = { Paper }>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">資料庫名稱</TableCell>
                                <TableCell align="right">資料總筆數</TableCell>
                                <TableCell align="right">最新資料日期</TableCell>
                                <TableCell align="right">資料總表下載</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data0.map((row) => (
                                <TableRow key = { row }>
                                    <TableCell>{row.dbName}</TableCell>
                                    <TableCell>{row.dataQuantity}</TableCell>
                                    <TableCell>{row.newestDate}</TableCell>
                                    <TableCell><CSVLink data = { row.allData } filename = { row.dbName + ".csv" }>Download me</CSVLink></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

export default DatabaseComp;