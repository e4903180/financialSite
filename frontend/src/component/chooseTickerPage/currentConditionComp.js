import React, { useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ConditionsContext } from './chooseTikcerComp';

function CurrentConditionComp() {
    const {conditions, handleConditionsRemove} = useContext(ConditionsContext);

    return (
        <>
            <div className = 'col-md-6' style = {{ height : "35vh" }}>
                <div className = 'card h-100 py-3 px-4'>
                    <div className = 'card-header text-center'>
                        目前篩選條件 (最多三個條件)
                    </div>

                    <div className = 'card-body'>
                        { conditions.length === 0 && <p className = 'text-center' style = {{ color : "red" }}>尚未選擇條件</p> }
                        { conditions.length !== 0 && 
                            <List component = "div" role = "list">
                                { conditions.map((item, i) => {
                                    return(
                                        <ListItem key = { i } role = "listitem" button = { true } onClick = {e => handleConditionsRemove(e.target.innerText)}>
                                            <ListItemText primary = { `${i + 1}. ` + item } />
                                        </ListItem>
                                    )
                                }) }
                            </List>
                        }
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default CurrentConditionComp;