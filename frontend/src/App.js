import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import HomeComp from './component/homePage/homeComp';
import LoginComp from './component/loginPage/loginComp';
import CalendarComp from './component/calendarPage/calendarComp';
import PrivateRoute from './privateRoute';

function App() {
  const [isUserAuthenticated, setisUserAuthenticated] = useState(false)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path = "*" element = { isUserAuthenticated ? <Navigate to = "/home" /> : <Navigate to = "/login" /> } ></Route>
          <Route exact path = "/login" element = { <LoginComp /> }></Route>

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
