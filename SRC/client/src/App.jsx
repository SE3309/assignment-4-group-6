import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import UserWelcomePage from "./components/UserWelcomePage"; // Adjust path as needed
import UserHeader from "./components/UserHeader"; // Adjust path as needed


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserWelcomePage" element={<UserWelcomePage />} /> {/* Add this line */}
        <Route path="/UserHeader" element={<UserHeader />} /> {/* Add this line */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
