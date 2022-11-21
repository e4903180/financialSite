import React from 'react';
import "highcharts/css/stocktools/gui.css";
import "highcharts/css/annotations/popup.css";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock'

import exporting from "highcharts/modules/exporting";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import HollowCandlestick from "highcharts/modules/hollowcandlestick.js";
import Heikinashi from "highcharts/modules/heikinashi.js";
import highchartsMore from 'highcharts/highcharts-more';

highchartsMore(Highcharts);
Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
FullScreen(Highcharts);
StockTools(Highcharts);
HollowCandlestick(Highcharts);
Heikinashi(Highcharts);
exporting(Highcharts);

function HighchartStockComp(props) {
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

export default HighchartStockComp;