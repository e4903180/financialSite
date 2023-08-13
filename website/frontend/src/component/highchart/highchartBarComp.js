import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import exporting from "highcharts/modules/exporting";

exporting(Highcharts);

function HighchartBarComp(props) {
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