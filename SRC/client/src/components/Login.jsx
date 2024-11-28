import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("user"); // Default to "user"

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "user") {
      // Call User Login API
      console.log("Calling User Login API...");
      // Replace with actual API call for user login
    } else if (role === "artist") {
      // Call Artist Login API
      console.log("Calling Artist Login API...");
      // Replace with actual API call for artist login
    }
  };

  return (
    <div className="landing-page">
      <div className="header">
        <div className="logo">
          <span className="logo-highlight">BRAT</span>music
        </div>
        <div className="auth-links">
          <span className="auth-link">log in</span>
          <span className="auth-link">sign up</span>
        </div>
      </div>
      <div className="content">
        <div className="login-box">
          <h1 className="login-title">LOGIN</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="role" className="form-label">LOGIN AS</label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="artist">Artist</option>
            </select>
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="form-input"
            />
            <label htmlFor="password" className="form-label">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="form-input"
            />
            <button type="submit" className="login-button">LOG IN</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
