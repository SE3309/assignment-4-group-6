import React from "react";
import "./welcome.css";

const WelcomePage = () => {
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
        <h1 className="welcome-title">WELCOME TO</h1>
        <div className="brand-name">
          <span className="brand-highlight">BRAT</span>music
        </div>

      </div>
    </div>
  );
};


export default WelcomePage;
