import React from 'react';

function PricingComp(props) {
    return (
        <div className = 'card h-100' style = {{ minHeight : "200px" }}>
            <div className = 'card-body'>
                <h3 className = 'card-title'>{ props.pricingName }</h3>
                <div className = 'row' style = {{ minHeight : "100px" }}>
                    <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain1"] }</h6>
                    <br/>
                    <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain2"] }</h6>
                </div>

                <ul className = "list-group list-group-flush">
                    <li className = "list-group-item">{ props.pricingExplain["explain3"] }{ props.lowPrice }</li>
                    <li className = "list-group-item">{ props.pricingExplain["explain4"] }{ props.resonablePrice }</li>
                    <li className = "list-group-item">{ props.pricingExplain["explain5"] }{ props.highPrice }</li>
                </ul>
            </div>
        </div>
    );
}

export default PricingComp;