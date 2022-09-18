import React from 'react';
import HighchartStockComp from '../highchart/highchatStockComp';

function PerRiverComp(props) {
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
                </div>

                <HighchartStockComp options = {props.options} />
            </div>
        </>
    );
}

export default PerRiverComp;