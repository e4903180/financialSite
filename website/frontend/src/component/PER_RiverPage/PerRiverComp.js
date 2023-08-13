import React from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

function PerRiverComp(props) {
    return (
        <>
            <div className = 'card h-100'>
                <div className = "card-header">
                    <AiFillCaretDown style = {{ cursor : "pointer" }} data-bs-toggle = "collapse" data-bs-target = {"#" + props.cardKey} aria-expanded = "false" aria-controls = {props.cardKey}/>
                    本益比河流圖計算數據
                </div>

                <div className = "collapse" id = {props.cardKey}>
                    <div className = 'card-body'>
                        <h3 className = 'card-title'>{ props.pricingName }</h3>
                        <div className = 'row' style = {{ minHeight : "100px" }}>
                            <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain1"] }</h6>
                            <br/>
                            <h6 className = "card-subtitle text-muted">{ props.pricingExplain["explain2"] }</h6>
                        </div>

                        <div className = "alert alert-warning text-center" role = "alert">
                            便宜價 = EPS({ props.content["EPS"] }) x { props.label[0].slice(0, -1) } = { props.content["cheap"] }
                        </div>

                        <div className = "alert alert-success text-center" role = "alert">
                            合理價 = EPS({ props.content["EPS"] }) x { props.label[1].slice(0, -1) } = { props.content["reasonable"] }
                        </div>

                        <div className = "alert alert-danger text-center" role = "alert">
                            昂貴價 = EPS({ props.content["EPS"] }) x { props.label[2].slice(0, -1) } = { props.content["expensive"] }
                        </div>

                        <div className = 'card-text text-center'>{ props.content["evaluate"] }</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PerRiverComp;