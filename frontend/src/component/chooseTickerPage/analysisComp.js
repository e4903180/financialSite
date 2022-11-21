import React, { useState } from 'react';

function AnalysisComp() {
    const [filter, setFilter] = useState(["無", "無", "無"])

    return (
        <>
            <div className = "card h-100 p-0">
                <div className = "card-header text-center">
                    目前篩選條件
                </div>

                <div className = "card-body">
                    <ul className = 'list-group list-group-flush'>
                        {
                            filter.map(function(ele, i){
                                return <li className = "list-group-item">{ele}</li>
                            })
                        }
                    </ul>
                </div>
            </div>

            <div className = "card h-100 p-0 mt-3">
                <div className = "card-header text-center">
                    篩選條件
                </div>

                <div className = 'mx-3 mt-2'>
                    <ul className = "nav nav-tabs">
                        <li className = "nav-item">
                            <button className = "nav-link active" data-bs-toggle = "tab">產業</button>
                        </li>

                        <li className = "nav-item">
                            <button className = "nav-link" data-bs-toggle = "tab">基本面</button>
                        </li>

                        <li className = "nav-item">
                            <button className = "nav-link" data-bs-toggle = "tab">技術面</button>
                        </li>
                    </ul>

                    <div className = "card-body">
                        <h5 className = "card-title">Special title treatment</h5>
                        <p className = "card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href = "#" className = "btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AnalysisComp;