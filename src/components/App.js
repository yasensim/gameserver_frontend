import React from "react";
import UserLoginPage from "../components/UserLoginPage";
import GamePage from "../components/GamePage";
import HomePage from "../components/HomePage";
import { Route, Routes, Redirect } from "react-router-dom";


function App() {
  return (

    <div className="container-fluid">

      <Routes>
        <Route path="/" exact element={HomePage} />
        <Route path="/login" exact render={(props) => (
          <UserLoginPage {...props} register={false} />
        )} />

        <Route path="/gamepage" exact element={GamePage} />
        <Route path="/gamepage/:id" exact element={GamePage} />

        <Route path="/login/:id" exact render={(props) => (
          <UserLoginPage {...props} register={false} />
        )} />
      </Routes>
    </div>

  );
}

export default App;
