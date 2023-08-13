import React from 'react';
import LineQRcode from "../../image/760eyprv.png"

function LineComp() {
    return (
        <>
            <div className = 'row mx-auto mt-5' style = {{ width : "50vw" }}>
                <div className = 'card'>
                    <div className = 'row'>
                        <div className = 'col-md-4 text-center'>
                            <img alt = {"lineQRcode"} src = {LineQRcode} className = "img-fluid"></img>
                            <a href = 'https://line.me/R/ti/p/%40760eyprv'>點此加入</a>
                        </div>

                        <div className = 'col-md-8'>
                            <div className = 'row pt-5'>
                                <p>1. 掃QRcode加入官方Line</p>
                                <p>2. 輸入 /綁定帳號 你的username</p>
                                <p>3. 等待警示條件觸發</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LineComp;