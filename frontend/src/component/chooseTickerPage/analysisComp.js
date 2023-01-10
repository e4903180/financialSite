import React, { useState } from 'react';
import TechnicalAnalyzeComp from './technicalAnalyzeComp';
import Tabs from "@mui/material/Tabs";
import Tab from '@mui/material/Tab';

function AnalysisComp() {
    const [type, setType] = useState(0)

    const handleChange = (event, newValue) => {
        setType(newValue);
    };

    return (
        <>
            <div className = 'col-md-6' style = {{ height : "35vh" }}>
                <div className = 'card h-100 py-3 px-4'>
                    <Tabs value = { type } onChange = { handleChange } variant = "scrollable" scrollButtons = "auto">
                        <Tab label = "基本面"></Tab>
                        <Tab label = "技術面"></Tab>
                    </Tabs>

                    <div className = 'card-body'>
                        { type === 0 && <div>基本面</div> }
                        { type === 1 && <TechnicalAnalyzeComp /> }
                    </div>
                </div>
            </div>
        </>
    );
}

export default AnalysisComp;