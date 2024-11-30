import React, { useState, useEffect } from 'react';

const ArtistTotalRev = ({ artistEmail }) =>
{
    const [revenueData, setRevenueData] = useState({
        revenueGenerated: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        const fetchRevenue = async () =>
        {
            try
            {
                const response = await fetch('/api/artist-revenue', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: artistEmail }),
                });

                if (!response.ok)
                {
                    throw new Error('Failed to fetch revenue data');
                }

                const data = await response.json();
                setRevenueData(data);
                setLoading(false);
            } catch (err)
            {
                setError(err.message);
                setLoading(false);
            }
        };

        if (artistEmail)
        {
            fetchRevenue();
        }
    }, [artistEmail]);

    if (loading)
    {
        return (
            <div style={{
                padding: '32px',
                backgroundColor: '#2A2B2A',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: '100vh',
                width: '100vw'
            }}>
                <div>
                    <div style={{ height: '24px', backgroundColor: '#6c757d', width: '150px', marginBottom: '8px' }}></div>
                    <div style={{ height: '48px', backgroundColor: '#6c757d', width: '300px' }}></div>
                </div>
            </div>
        );
    }

    if (error)
    {
        return (
            <div style={{
                padding: '32px',
                backgroundColor: '#dc3545',
                color: '#f8d7da',
                height: '100vh',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100vw'
            }}>
                <p>Error loading revenue data: {error}</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '32px',
            backgroundColor: '#000000', // Black background
            color: 'white', // White text color
            fontSize: '96px', // Large font size for the amount
            fontWeight: 'bold', // Bold font weight
            display: 'flex',
            justifyContent: 'flex-start', // Aligns content to the top left
            alignItems: 'flex-start', // Aligns content to the top left
            height: '100vh', // Full viewport height
            width: '100vw' // Full viewport width
        }}>
            <div>
                <h3 style={{
                    fontSize: '24px', // Smaller font size for the title
                    fontWeight: 'normal', // Normal weight for the title
                    opacity: 0.75, // Slightly transparent
                    marginBottom: '20px' // Space below the title
                }}>Your total revenue generated...</h3>
                <div>
                    ${revenueData.revenueGenerated.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </div>
            </div>
        </div>
    );
};

export default ArtistTotalRev;
