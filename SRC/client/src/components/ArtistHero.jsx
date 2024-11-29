import React from 'react';
import Logo from '../assets/BMLogo.png';

const ArtistHero = () =>
{
    const styles = {
        container: {
            width: '100vw',
            height: '100vh',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            boxSizing: 'border-box',
        },
        content: {
            textAlign: 'center',
            maxWidth: '1200px',
            width: '100%',
        },
        title: {
            color: 'white',
            fontSize: '4rem',
            fontWeight: 'bold',
            lineHeight: 1.2,
            margin: 0,
            letterSpacing: '1px',
            textTransform: 'uppercase',
        },
        image: {
            width: '40rem',
            height: 'auto',
            objectFit: 'cover',
            marginBottom: '2rem',
        },
        responsiveTitle: {
            fontSize: '2.5rem',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <img src={Logo} alt="Logo" style={styles.image} />
                <h1 style={styles.title}>
                    WELCOME TO YOUR<br />
                    ARTIST PAGE
                </h1>
            </div>
        </div>
    );
};

export default ArtistHero;