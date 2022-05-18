import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import HomeComp from './component/homePage/homeComp';
import LoginComp from './component/loginPage/loginComp';
import RegisterComp from './component/registerPage/registerComp';
import CalendarComp from './component/calendarPage/calendarComp';
import PrivateRoute from './privateRoute';
import LoginRoute from './login_privateRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path = "*" element = { <p>Error</p> } ></Route>

          <Route element = { <LoginRoute /> } >
            <Route exact path = "/login" element = { <LoginComp /> }></Route>
          </Route>

          <Route path = "/register" element = { <RegisterComp /> }></Route>
          
          <Route element = { <PrivateRoute /> } >
            <Route path = "/home" element = { <HomeComp /> }></Route>
            <Route path = "/calendar" element = { <CalendarComp /> }></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
