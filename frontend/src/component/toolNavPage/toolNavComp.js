import React from 'react';
import { baseAna, elseAna, techAna } from '../../constant';

function ToolNavComp() {
    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <div className = "card h-100 p-0">
                    <div className = "card-header text-center">
                        基本面分析
                    </div>

                    <div className = "card-body">
                        <ul className = 'list-group list-group-flush'>
                            {
                                baseAna.map(function(ele, i){
                                    return <li className = "list-group-item" ><a href = {ele["url"]}>{ele["method"]}</a></li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <div className = "card h-100 p-0">
                    <div className = "card-header text-center">
                        技術面分析
                    </div>

                    <div className = "card-body">
                        <ul className = 'list-group list-group-flush'>
                            {
                                techAna.map(function(ele, i){
                                    return <li className = "list-group-item"><a href = {ele["url"]}>{ele["method"]}</a></li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <div className = "card h-100 p-0">
                    <div className = "card-header text-center">
                        其他
                    </div>

                    <div className = "card-body">
                        <ul className = 'list-group list-group-flush'>
                            {
                                elseAna.map(function(ele, i){
                                    return <li className = "list-group-item"><a href = {ele["url"]}>{ele["method"]}</a></li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ToolNavComp;