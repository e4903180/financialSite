import React from 'react';
import "./highchart.css";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock'

import indicatorsAll from "highcharts/indicators/indicators-all";
import annotationsAdvanced from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import stockTools from "highcharts/modules/stock-tools";

function HighchartComp(props) {
    indicatorsAll(Highcharts);
    annotationsAdvanced(Highcharts);
    priceIndicator(Highcharts);
    fullScreen(Highcharts);
    stockTools(Highcharts);

    return (
        <>
            <HighchartsReact
                highcharts = { Highcharts }
                constructorType = { 'stockChart' }
                options = { props.options }
            />
        </>
    );
}

export default HighchartComp;