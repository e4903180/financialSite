import React from 'react';
import ReactPlayer from 'react-player/lazy'
import InflationCard from './inflationCard';

function InflationComp() {
    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">通膨分析</h3>
            </div>

            <InflationCard />

            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-10 mx-auto'>
                    <div className = 'card h-100'>
                        <div className = "card-header text-center">
                            參考資料
                        </div>

                        <div className = 'card-body'>
                            <div className = 'col-md-6 mx-auto text-center'>
                                <ReactPlayer controls = {true} url = 'https://www.youtube.com/watch?v=f59UTkarc1E&ab_channel=%E9%A2%A8%E5%82%B3%E5%AA%92TheStormMedia' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InflationComp;