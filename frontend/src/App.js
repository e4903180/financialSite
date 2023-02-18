import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
// import HomeComp from './component/homePage/homeComp';
import LoginComp from './component/loginPage/loginComp';
import RegisterComp from './component/registerPage/registerComp';
import CalendarComp from './component/calendarPage/calendarComp';
import PrivateRoute from './privateRoute';
import LoginRoute from './login_privateRoute';
import DatabaseComp from './component/databasePage/databaseComp';
import PostBoardComp from './component/postBoardPage/postBoardComp';
import LineMemoComp from './component/lineMemoPage/lineMemoComp';
import MeetingDataComp from './component/meetingDataPage/meetingDataComp';
import IndustryAnalysisComp from './component/Industry_analysisPage/Industry_analysisComp';
import UserListComp from './component/userListPage/userListComp';
import DatabaseSearchComp from './component/databasePage/databaseSearchComp';
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
import NewsComp from './component/newsPage/newsComp'
import HomeComp1 from './component/homePage/homeComp1';
import SelfEditComp from './component/selfEdit/selfEditComp';
import { config } from './constant';
import IndustryComp from './component/industryPage/industryComp';
import IndustryUploadComp from './component/industryUploadPage/industryUploadComp';
import IndustryEditComp from './component/industryEditPage/industryEditComp';
import DbAutoSearch from './component/homePage/dbAutoSearch';

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "*" element = { <Navigate to = { config.rootPathPrefix + "/login" }/> } ></Route>

          <Route element = { <LoginRoute /> } >
            <Route exact path = { config.rootPathPrefix + "/login" } element = { <LoginComp /> }></Route>
            <Route exact path = { config.rootPathPrefix + "/register" } element = { <RegisterComp /> }></Route>
          </Route>
          
          <Route element = { <PrivateRoute /> } >
            <Route path = { config.rootPathPrefix + "/home" } element = { <HomeComp1 /> }></Route>
            <Route exact path = { config.rootPathPrefix + "/home/search/:stock_num_name" } element = { <DbAutoSearch /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/calendar" } element = { <CalendarComp /> }></Route>
            <Route path = { config.rootPathPrefix + "/database" } element = { <DatabaseComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/industry" } element = { <IndustryComp /> }></Route>
            <Route exact path = { config.rootPathPrefix + "/database/search/:stock_num_name" } element = { <DatabaseSearchComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/post_board" } element = { <PostBoardComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/news" } element = { <NewsComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/line_memo" } element = { <LineMemoComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/meeting_data" } element = { <MeetingDataComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/industry_analysis" } element = { <IndustryAnalysisComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/userList" } element = { <UserListComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/stock_pricing_stratagy" } element = { <StockPricingStratagyComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/PER_River" } element = { <PERRiverComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/support_resistance" } element = { <SupportResistanceComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/subscibe_list" } element = { <SubListComp /> } ></Route>
            <Route path = { config.rootPathPrefix + "/choose_ticker" } element = { <ChooseTickerComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/choose_ticker/detail" } element = { <ChooseTickerDetail /> }></Route>
            <Route exact path = { config.rootPathPrefix + "/self_edit" } element = { <SelfEditComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/self_upload" } element = { <SelfUploadPage /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/industry_upload" } element = { <IndustryUploadComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/industry_edit" } element = { <IndustryEditComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/tool_nav" } element = { <ToolNavComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/inflation" } element = { <InflationComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/cpi_ppi_pce" } element = { <CpiPpiPceComp /> } ></Route>
            <Route exact path = { config.rootPathPrefix + "/Line" } element = { <LineComp /> } ></Route>
          </Route>
        </Routes>
      </BrowserRouter>

      {/* <ScrollTopButton /> */}
    </>
  );
}

export default App;
