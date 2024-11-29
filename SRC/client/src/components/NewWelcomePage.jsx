import React from 'react';
import Logo from '../assets/BMLogo.png';
import NewNavBar from './NewNavBar';

const NewWelcomePage = () =>
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
            <NewNavBar />
            <div style={styles.content}>
                <h1 style={styles.title}>
                    WELCOME TO
                </h1>
                <img src={Logo} alt="Logo" style={styles.image} />
            </div>
        </div>
    );
};

export default NewWelcomePage;