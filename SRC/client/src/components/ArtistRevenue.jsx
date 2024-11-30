import React, { useState, useEffect } from 'react';
import ArtistNavBar from './ArtistNavBar';
import ArtistTotalRev from './ArtistTotalRev';

const ArtistRevenue = () =>
{
    const [artistEmail, setArtistEmail] = useState('');

    const containerStyle = {
        paddingTop: '50px', // To account for fixed navbar
    };

    useEffect(() =>
    {
        const artistInfo = JSON.parse(localStorage.getItem('artist'));
        if (artistInfo && artistInfo.email)
        {
            setArtistEmail(artistInfo.email);
        }
    }, []);

    return (
        <div style={containerStyle}>
            <ArtistNavBar />
            {artistEmail ? (
                <ArtistTotalRev artistEmail={artistEmail} />
            ) : (
                <div>
                    No artist logged in. Please log in first.
                </div>
            )}
        </div>
    );
};

export default ArtistRevenue;

