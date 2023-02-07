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

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "*" element = { <Navigate to = "/login"/> } ></Route>

          <Route element = { <LoginRoute /> } >
            <Route exact path = "/login" element = { <LoginComp /> }></Route>
            <Route exact path = "/register" element = { <RegisterComp /> }></Route>
          </Route>
          
          <Route element = { <PrivateRoute /> } >
            <Route exact path = "/home" element = { <HomeComp1 /> }></Route>
            <Route exact path = "/calendar" element = { <CalendarComp /> }></Route>
            <Route path = "/database" element = { <DatabaseComp /> } ></Route>
            <Route exact path = "/database/search/:stock_num_name" element = { <DatabaseSearchComp /> } ></Route>
            <Route exact path = "/post_board" element = { <PostBoardComp /> } ></Route>
            <Route exact path = "/news" element = { <NewsComp /> } ></Route>
            <Route exact path = "/line_memo" element = { <LineMemoComp /> } ></Route>
            <Route exact path = "/meeting_data" element = { <MeetingDataComp /> } ></Route>
            <Route exact path = "/industry_analysis" element = { <IndustryAnalysisComp /> } ></Route>
            <Route exact path = "/userList" element = { <UserListComp /> } ></Route>
            <Route exact path = "/stock_pricing_stratagy" element = { <StockPricingStratagyComp /> } ></Route>
            <Route exact path = "/PER_River" element = { <PERRiverComp /> } ></Route>
            <Route exact path = "/support_resistance" element = { <SupportResistanceComp /> } ></Route>
            <Route exact path = "/subscibe_list" element = { <SubListComp /> } ></Route>
            <Route path = "/choose_ticker" element = { <ChooseTickerComp /> } ></Route>
            <Route exact path = "/choose_ticker/detail" element = { <ChooseTickerDetail /> }></Route>
            <Route exact path = "/self_upload" element = { <SelfUploadPage /> } ></Route>
            <Route exact path = "/tool_nav" element = { <ToolNavComp /> } ></Route>
            <Route exact path = "/inflation" element = { <InflationComp /> } ></Route>
            <Route exact path = "/cpi_ppi_pce" element = { <CpiPpiPceComp /> } ></Route>
            <Route exact path = "/Line" element = { <LineComp /> } ></Route>
            <Route exact path = "/selfEdit" element = { <SelfEditComp /> } ></Route>
          </Route>
        </Routes>
      </BrowserRouter>

      {/* <ScrollTopButton /> */}
    </>
  );
}

export default App;
