import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import exporting from "highcharts/modules/exporting";

function HighchartBarComp(props) {
    exporting(Highcharts);
    
    return (
        <>
            <HighchartsReact
                highcharts = { Highcharts }
                options = { props.options }
            />
        </>
    );
}

export default HighchartBarComp;