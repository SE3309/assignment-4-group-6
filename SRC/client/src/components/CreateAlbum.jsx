import React, { useState } from 'react';

const CreateAlbum = () =>
{
    const [albumName, setAlbumName] = useState('');

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        console.log('Album name:', albumName);
    };

    const styles = {
        container: {
            width: '100%',
            minHeight: 'calc(100vh - 70px)',
            marginTop: '70px',
            backgroundColor: '#1a1a1a',
            padding: '2rem',
        },
        content: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        title: {
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            textTransform: 'lowercase',
        },
        form: {
            width: '100%',
        },
        inputGroup: {
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
        },
        albumInput: {
            flex: 1,
            padding: '1rem',
            border: '2px solid #a5ff00',
            borderRadius: '50px',
            backgroundColor: 'transparent',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
        },
        albumInputPlaceholder: {
            color: 'rgba(255, 255, 255, 0.7)',
        },
        createButton: {
            padding: '1rem 2.5rem',
            border: 'none',
            borderRadius: '50px',
            backgroundColor: '#a5ff00',
            color: 'black',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            textTransform: 'lowercase',
            transition: 'background-color 0.3s ease',
        },
        createButtonHover: {
            backgroundColor: '#8fe600',
        },
        mediaQuery: {
            inputGroup: {
                flexDirection: 'column',
            },
            createButton: {
                width: '100%',
            },
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>create album</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <input
                            type="text"
                            value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)}
                            placeholder="Enter Album Name"
                            style={styles.albumInput}
                        />
                        <button
                            type="submit"
                            style={styles.createButton}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.createButtonHover.backgroundColor}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.createButton.backgroundColor}
                        >
                            create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbum;