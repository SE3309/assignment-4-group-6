import React from 'react';
import './ArtistHeroStyles.css';
import Logo from '../assets/BMLogo.png';

const ArtistHero = () =>
{
    return (
        <div className="hero-container">
            <div className="hero-content">
               <img src={Logo} className='hero-image'></img>
                <h1 className="hero-title">
                    WELCOME TO YOUR<br />
                    ARTIST PAGE
                </h1>
            </div>
        </div>
    );
};

export default ArtistHero;