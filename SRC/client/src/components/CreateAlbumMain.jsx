import React, { useState, useEffect } from 'react';
import ArtistNavBar from './ArtistNavBar';

const CreateAlbumMain = () =>
{
    // Define styles first
    const styles = {
        container: {
            width: '100vw',
            minHeight: 'calc(100vh - 70px)',
            marginTop: '70px',
            backgroundColor: '#1a1a1a',
            padding: '2rem',
            boxSizing: 'border-box',
        },
        content: {
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
        statusMessage: {
            marginTop: '1rem',
            color: 'white',
            fontSize: '1rem',
        },
        loadingText: {
            color: 'white',
            fontSize: '1rem',
        },
        noArtistMessage: {
            color: 'white',
            padding: '2rem',
            textAlign: 'center'
        }
    };

    // State definitions
    const [albumName, setAlbumName] = useState('');
    const [artistName, setArtistName] = useState('');
    const [artistEmail, setArtistEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Get artist email from localStorage on mount
    useEffect(() =>
    {
        const artistInfo = JSON.parse(localStorage.getItem('artist'));
        if (artistInfo && artistInfo.email)
        {
            setArtistEmail(artistInfo.email);
        } else
        {
            setIsLoading(false);
        }
    }, []);

    // Fetch artist name when we have the email
    useEffect(() =>
    {
        const fetchArtistName = async () =>
        {
            if (!artistEmail)
            {
                setIsLoading(false);
                return;
            }

            try
            {
                const response = await fetch('/api/get-artist-name', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: artistEmail }),
                });

                if (!response.ok)
                {
                    throw new Error('Failed to fetch artist name');
                }

                const data = await response.json();
                setArtistName(data.artistName);
            } catch (error)
            {
                console.error('Error fetching artist name:', error);
                setStatusMessage('Error loading artist information');
            } finally
            {
                setIsLoading(false);
            }
        };

        fetchArtistName();
    }, [artistEmail]);

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if (!albumName.trim())
        {
            setStatusMessage('Please enter an album name');
            return;
        }

        if (!artistName)
        {
            setStatusMessage('Unable to create album - artist authentication required');
            return;
        }

        try
        {
            const response = await fetch('/api/createAlbum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    artistName,
                    albumName: albumName.trim()
                }),
            });

            const result = await response.json();

            if (response.ok)
            {
                setStatusMessage(`Album "${albumName}" created successfully!`);
                setAlbumName(''); // Clear input after successful creation
            } else
            {
                setStatusMessage(`Error: ${result.error}`);
                console.error(result.details);
            }
        } catch (error)
        {
            setStatusMessage('An unexpected error occurred.');
            console.error('Error:', error);
        }
    };

    if (isLoading)
    {
        return (
            <div style={styles.container}>
                <ArtistNavBar />
                <div style={styles.content}>
                    <p style={styles.loadingText}>Loading artist information...</p>
                </div>
            </div>
        );
    }

    if (!artistEmail)
    {
        return (
            <div style={styles.container}>
                <ArtistNavBar />
                <div style={styles.noArtistMessage}>
                    No artist logged in. Please log in first.
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <ArtistNavBar />
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
                            onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                styles.createButtonHover.backgroundColor)
                            }
                            onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                styles.createButton.backgroundColor)
                            }
                        >
                            create
                        </button>
                    </div>
                </form>
                {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
            </div>
        </div>
    );
};

export default CreateAlbumMain;