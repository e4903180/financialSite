import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
// import HomeComp from './component/homePage/homeComp';
import LoginComp from './component/loginPage/loginComp';
import PrivateRoute from './privateRoute';
import LoginRoute from './login_privateRoute';
import UserListComp from './component/userListPage/userListComp';
import StockPricingStratagyComp from './component/stock_pricing_stratagyPage/stock_pricing_stratagyComp';
import PERRiverComp from './component/PER_RiverPage/PER_RiverComp';
import SupportResistanceComp from './component/support_resistance_page/support_resistance_comp';
// import ScrollTopButton from './component/scrollTopButton/ScrollTopButton';
import axios from 'axios';
import SubListComp from './component/subListPage/subListComp';
import ChooseTickerComp from './component/chooseTickerPage/chooseTikcerComp';
import SelfUploadPage from './component/selfUploadPage/selfUploadPage';
import ToolNavComp from './component/toolNavPage/toolNavComp';
import InflationComp from './component/inflationPage/inflationComp';
import CpiPpiPceComp from './component/CpiPpiPcePage/CpiPpiPceComp';
import LineComp from './component/LinePage/LineComp';
import ChooseTickerDetail from './component/chooseTickerPage/chooseTickerDetail';
import HomeComp from './component/homePage/homeComp';
import SelfEditComp from './component/selfEdit/selfEditComp';
import { config } from './constant';
import OtherUploadComp from './component/financialDataOtherUploadPage/financialDataOtherUploadComp';
import OtherEditComp from './component/financialDataOtherEditPage/financialDataOtherEditComp';
import FinancialDataIndustryUploadComp from './component/financialDataIndustryUploadPage/financialDataIndustryUploadComp';
import DbAutoSearch from './component/dbSearchPage/dbAutoSearch';
import DatabaseComp from './component/databasePage/databaseComp';
import TopTickerComp from './component/topTickerPage/topTickerComp';
import TwseRecommendComp from './component/TwseRecommendPage/twseRecommendComp';

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "*" element = { <Navigate to = { config.rootPathPrefix + "/login" }/> } ></Route>

          <Route element = { <LoginRoute /> } >
            <Route exact path = { config.rootPathPrefix + "/login" } element = { <LoginComp /> }></Route>
          </Route>
          
          <Route element = { <PrivateRoute /> } >
            <Route path = { config.rootPathPrefix + "/home" } element = { <HomeComp /> }></Route>
            <Route path = { config.rootPathPrefix + "/database" } element = { <DatabaseComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/database/search/:stock_num_name" } element = { <DbAutoSearch /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/userList" } element = { <UserListComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/stock_pricing_stratagy" } element = { <StockPricingStratagyComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/PER_River" } element = { <PERRiverComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/support_resistance" } element = { <SupportResistanceComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/subscibe_list" } element = { <SubListComp /> } ></Route>
            <Route path = { config.rootPathPrefix + "/choose_ticker" } element = { <ChooseTickerComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/choose_ticker/detail" } element = { <ChooseTickerDetail /> }></Route>
            <Route exact path = { config.rootPathPrefix + "/self_edit" } element = { <SelfEditComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/self_upload" } element = { <SelfUploadPage /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/other_upload" } element = { <OtherUploadComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/other_edit" } element = { <OtherEditComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/industry_upload" } element = { <FinancialDataIndustryUploadComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/tool_nav" } element = { <ToolNavComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/inflation" } element = { <InflationComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/cpi_ppi_pce" } element = { <CpiPpiPceComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/Line" } element = { <LineComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/top_ticker" } element = { <TopTickerComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/twse_recommend" } element = { <TwseRecommendComp /> } ></Route>
          </Route>
        </Routes>
      </BrowserRouter>

      {/* <ScrollTopButton /> */}
    </>
  );
}

export default App;
