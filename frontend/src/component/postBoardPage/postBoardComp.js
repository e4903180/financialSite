import React, { useState } from 'react';
import InputBlockComp from './inputBlockComp';
import SearchBlockComp from './searchBlockComp';

function PostBoardComp() {
    const [function1, setFunction1] = useState(true)
    const [function2, setFunction2] = useState(false)

    function button1(e){
        e.preventDefault()

        setFunction1(true)
        setFunction2(false)
    }

    function button2(e){
        e.preventDefault()

        setFunction1(false)
        setFunction2(true)
    }

    return (
        <>
            <div className = 'row mx-auto py-3' style = {{ width : "90%" }}>
                <div className = 'col-md-3'>
                    <div className = 'list-group mt-2'>
                        { function1 ? <button className = 'list-group-item list-group-item-action active' onClick = { button1 }>個股推薦資料輸入</button>:<button className = 'list-group-item list-group-item-action' onClick = { button1 }>個股推薦資料輸入</button>}
                        { function2 ? <button className = 'list-group-item list-group-item-action active' onClick = { button2 }>個股推薦資料查詢</button>:<button className = 'list-group-item list-group-item-action' onClick = { button2 }>個股推薦資料查詢</button>}
                    </div>
                </div>

                <div className = 'col-md-9'>
                    { function1 ? <InputBlockComp /> : <SearchBlockComp /> }
                </div>
            </div>
        </>
    );
}

export default PostBoardComp;