import React from 'react';
import './ArtistNavbarStyles.css';
import Logo from '../assets/BMLogo.png';
import profileLogo from '../assets/profileLogo.png';

const ArtistNavBar = () =>
{
    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src={Logo} alt="BRAT music" className="logo" />
            </div>

            <div className="nav-items">
                <a href="#revenue">revenue generated</a>
                <a href="#albums">albums</a>
                <a href="#songs">songs</a>
                <a href=''><img src={profileLogo} alt="Profile" className="profile-icon" /></a>
            </div>
        </nav>
    );
};

export default ArtistNavBar;