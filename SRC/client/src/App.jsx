import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import UserWelcomePage from "./components/UserWelcomePage";
import UserHeader from "./components/UserHeader";

function App() {
  return (
    <BrowserRouter>
      {/* Always render the header */}
      <UserHeader /> 
      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/UserHeader" element={UserHeader} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/UserWelcomePage" element={<UserWelcomePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
