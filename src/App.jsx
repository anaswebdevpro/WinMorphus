import React from "react";
import "./App.css";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import MainNavbar from "./Component/MainNavbar";

const App = () => {
  return (
    <div>
      {/* <MainNavbar/> */}
      <Login />
      <Signup />
    </div>
  );
};

export default App;
