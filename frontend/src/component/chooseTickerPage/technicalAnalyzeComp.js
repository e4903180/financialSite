import React, { useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ConditionsContext } from './chooseTikcerComp';

function TechnicalAnalyzeComp() {
    const {handleConditionsAdd} = useContext(ConditionsContext);

    const condition = ["5ma突破30ma黃金交叉", "5ma突破30ma死亡交叉", "KD黃金交叉", "KD死亡交叉", "天花板地板線20wma方法一", "天花板地板線20wma方法二", "天花板地板線20wma方法三"]

    return (
        <>
            <List component = "div" role = "list" style={{ maxHeight: '25vh', overflow: 'auto' }}>
                {condition.map((item, i) => {
                    return(
                        <ListItem key = { i } role = "listitem" button = { true } onClick = { e => handleConditionsAdd(e.target.innerText) }>
                            <ListItemText primary = { item } />
                        </ListItem>
                    )
                })}
            </List>
        </>
    );
}

export default TechnicalAnalyzeComp;