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
                        {(() => {
                            let list_render = []
                            let i = 0

                            while(i < techAna.length){
                                list_render.push(
                                    <ul key = {i} className = "list-group list-group-horizontal text-center">
                                        {
                                            baseAna.slice(i, i + 3).map(function(ele, idx){
                                                return <li key = {idx} className = "list-group-item flex-fill"><a href = {ele["url"]}>{ele["method"]}</a></li>
                                            })
                                        }
                                    </ul>
                                )

                                i += 3
                            };

                            return list_render
                        })()}
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <div className = "card h-100 p-0">
                    <div className = "card-header text-center">
                        技術面分析
                    </div>

                    <div className = "card-body">
                        {(() => {
                            let list_render = []
                            let i = 0

                            while(i < techAna.length){
                                list_render.push(
                                    <ul key = {i} className = "list-group list-group-horizontal text-center">
                                        {
                                            techAna.slice(i, i + 3).map(function(ele, idx){
                                                return <li key = {idx} className = "list-group-item flex-fill"><a href = {ele["url"]}>{ele["method"]}</a></li>
                                            })
                                        }
                                    </ul>
                                )

                                i += 3
                            };

                            return list_render
                        })()}
                    </div>
                </div>
            </div>

            <div className = 'row mx-auto py-3' style = {{ width : "50vw" }}>
                <div className = "card h-100 p-0">
                    <div className = "card-header text-center">
                        總經分析
                    </div>

                    <div className = "card-body">
                        {(() => {
                            let list_render = []
                            let i = 0

                            while(i < techAna.length){
                                list_render.push(
                                    <ul key = {i} className = "list-group list-group-horizontal text-center">
                                        {
                                            elseAna.slice(i, i + 3).map(function(ele, idx){
                                                return <li key = {idx} className = "list-group-item flex-fill"><a href = {ele["url"]}>{ele["method"]}</a></li>
                                            })
                                        }
                                    </ul>
                                )

                                i += 3
                            };

                            return list_render
                        })()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ToolNavComp;