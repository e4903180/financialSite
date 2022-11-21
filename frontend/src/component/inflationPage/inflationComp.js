import React from 'react';
import CpiFedCard from './CpiFedCard';

function InflationComp() {
    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <h3 className = "display-6 text-center">通膨分析</h3>
            </div>

            <CpiFedCard />
        </>
    );
}

export default InflationComp;