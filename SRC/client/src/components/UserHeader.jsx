import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from '../assets/BMLogo.png';
import profileLogo from "../assets/greenProfileLogo.png"; // Adjust the path based on the file structure

const UserHeader = () =>
  {
      const navbarStyle = {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          backgroundColor: 'black',
          color: 'white',
          width: '100%',
          height: '70px',
          position: 'fixed',
          top: 0,
          left: 0,
          boxSizing: 'border-box'
      };
  
      const logoContainerStyle = {
          display: 'flex',
          alignItems: 'center',
          marginRight: 'auto'
      };
  
      const logoStyle = {
          paddingTop: '5px',
          paddingBottom: '5px',
          height: '50px',
          width: 'auto'
      };
  
      const navItemsStyle = {
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem'
      };
  
      const linkStyle = {
          color: 'white',
          textDecoration: 'none',
          fontSize: '16px'
      };
  
      const profileIconStyle = {
          width: '35px',
          height: '35px',
          borderRadius: '50%'
      };
  
      return (
          <nav style={navbarStyle}>
              <div style={logoContainerStyle}>
                  <img src={Logo} alt="BRAT music" style={logoStyle} />
              </div>
  
              <div style={navItemsStyle}>
                  <Link to="/SearchAlbum" style={linkStyle}>Album</Link>
                  <Link to="/SearchSong" style={linkStyle}>Song</Link>
                  <Link to="/SearchArtist" style={linkStyle}>Artist</Link>
                  <Link to="/DisplayEvent" style={linkStyle}>Event</Link>
                  <Link to="/ProfileSettings" style={linkStyle}>Settings</Link>                 
                  <Link to="/" style={linkStyle}>Log out</Link>
                  <Link to="/profile" style={linkStyle}>
                      <img src={profileLogo} alt="Profile" style={profileIconStyle} />
                  </Link>
              </div>
          </nav>
      );
  };

export default UserHeader;
