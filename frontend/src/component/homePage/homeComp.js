import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
axios.defaults.withCredentials = true;

function HomeComp() {
    let [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://140.116.214.154:3000/api/data/first")
        .then(res => {
            setData(res.data);
        }).catch(res => {
        })
    }, [])

    return (
        <div className = 'container-fluid'>
            <div className = 'col-md-8 offset-md-2'>
                <h3 className = "display-4 text-center">最新15筆資料</h3>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>股票代號</TableCell>
                                <TableCell>股票名稱</TableCell>
                                <TableCell>資料日期</TableCell>
                                <TableCell>提供者</TableCell>
                                <TableCell>推薦</TableCell>
                                <TableCell>檔案下載</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            { 
                                data.map((row) => (
                                    <TableRow key = { row.ID }>
                                        <TableCell>{ row.stockNum }</TableCell>
                                        <TableCell>{ row.stockName }</TableCell>
                                        <TableCell>{ row.date }</TableCell>
                                        <TableCell>{ row.investmentCompany }</TableCell>
                                        <TableCell>{ row.recommand }</TableCell>
                                        <TableCell><a href = { "http://140.116.214.154:3000/api/data/download?filePath=" + row.filePath } download = { row.filePath.split("/")[-1]}>download</a></TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default HomeComp;

// /home/cosbi/桌面/financialData/gmailData/data/2887/2887-台新金-2022_5_05-統一投顧.pdf