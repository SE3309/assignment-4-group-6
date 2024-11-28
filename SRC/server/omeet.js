const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());
const PORT= 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bratmusic' // Correct database name
});

  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});


// API to create a new playlist
app.post('/createPlaylist', (req, res) => {
    const userId = req.body.userId; // User ID from the logged-in session or request
    const description = req.body.description; // Playlist description
    const mediaId = req.body.mediaId; // Media ID chosen by the user

    // Validate input
    if (!userId || !description || !mediaId) {
        return res.status(400).json({
            error: 'User ID, description, and Media ID are required.',
        });
    }

    // Current date for 'DateAdded'
    const dateAdded = new Date().toISOString().split('T')[0];

    // Check if the provided MediaID exists in the 'media' table
    const checkMediaQuery = `SELECT * FROM media WHERE MediaID = ?`;
    db.query(checkMediaQuery, [mediaId], (err, mediaResult) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({
                error: 'Failed to verify Media ID.',
                details: err.message,
            });
        }

        if (mediaResult.length === 0) {
            return res.status(400).json({
                error: 'Invalid Media ID. Please choose a valid media.',
            });
        }

        // Insert the playlist with the valid MediaID
        const insertPlaylistQuery = `INSERT INTO playlist (Creator, DateAdded, Description, MediaID) VALUES (?, ?, ?, ?)`;
        db.query(insertPlaylistQuery, [userId, dateAdded, description, mediaId], (err, result) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({
                    error: 'Failed to create playlist.',
                    details: err.message,
                });
            }

            res.status(200).json({
                message: 'Playlist created successfully!',
                playlistId: result.insertId,
            });
        });
    });
});

app.post('/createAlbum', (req, res) => {
    const artistName = req.body.artistName; // Simulating the logged-in artist
    const dateCreated = new Date().toISOString().split('T')[0]; // Today's date

    // Validate that the artist is logged in
    if (!artistName) {
        return res.status(400).json({ error: 'Artist name is required and should be logged in.' });
    }

    // Check if the artist exists in the 'artist' table
    const checkArtistQuery = `SELECT * FROM artist WHERE artistName = ?`;
    db.query(checkArtistQuery, [artistName], (err, artistResult) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to verify artist.', details: err.message });
        }

        if (artistResult.length === 0) {
            return res.status(400).json({ error: 'Invalid artist. Please ensure the artist is logged in.' });
        }

        // Insert a new album for the logged-in artist
        const insertAlbumQuery = `INSERT INTO album (artistName, dateCreated) VALUES (?, ?)`;
        db.query(insertAlbumQuery, [artistName, dateCreated], (err, result) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ error: 'Failed to create album.', details: err.message });
            }

            res.status(200).json({
                message: 'Album created successfully!',
                albumID: result.insertId,
                artistName: artistName,
                dateCreated: dateCreated,
            });
        });
    });
});


app.delete('/deleteAlbum/:albumID', (req, res) => {
    const albumID = req.params.albumID;

    // Check if the album exists
    const checkAlbumQuery = `SELECT * FROM album WHERE albumID = ?`;
    db.query(checkAlbumQuery, [albumID], (err, albumResult) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to check album.', details: err.message });
        }

        if (albumResult.length === 0) {
            return res.status(404).json({ error: 'Album not found.' });
        }

        // Delete the album
        const deleteAlbumQuery = `DELETE FROM album WHERE albumID = ?`;
        db.query(deleteAlbumQuery, [albumID], (err, result) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ error: 'Failed to delete album.', details: err.message });
            }

            res.status(200).json({ message: 'Album deleted successfully.', albumID });
        });
    });
});

// Delete a playlist by playlistID
app.delete('/deletePlaylist/:playlistID', (req, res) => {
    const playlistID = req.params.playlistID;

    // Check if the playlist exists
    const checkPlaylistQuery = `SELECT * FROM playlist WHERE PlaylistID = ?`;
    db.query(checkPlaylistQuery, [playlistID], (err, playlistResult) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to check playlist.', details: err.message });
        }

        if (playlistResult.length === 0) {
            return res.status(404).json({ error: 'Playlist not found.' });
        }

        // Delete the playlist
        const deletePlaylistQuery = `DELETE FROM playlist WHERE PlaylistID = ?`;
        db.query(deletePlaylistQuery, [playlistID], (err, result) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ error: 'Failed to delete playlist.', details: err.message });
            }

            res.status(200).json({ message: 'Playlist deleted successfully.', playlistID });
        });
    });
});

app.get('/userInfo/:email', (req, res) => {
    const email = req.params.email; // Assume this comes from the logged-in user's session

    console.log('Received email:', email);

    // Query to get user details
    const query = `SELECT UserID, DisplayName, StartDateOfSubscription, SubscriptionType, PlaylistLibraryID FROM user WHERE UserID = ?`;

    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve user details.', details: err.message });
        }

        console.log('Query result:', result);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'User details retrieved successfully.',
            user: result[0],
        });
    });
});

app.get('/artistInfo/:artistName', (req, res) => {
    const artistName = req.params.artistName; // Assume this comes from the logged-in artist's session

    // Query to get artist details based on the actual table structure
    const query = `SELECT artistName, totalDurationListenedTo, revenueGenerated, email FROM artist WHERE artistName = ?`;

    db.query(query, [artistName], (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve artist details.', details: err.message });
        }

        // Check if the artist exists
        if (result.length === 0) {
            return res.status(404).json({ message: 'Artist not found.' });
        }

        // Return the artist's details
        res.status(200).json({
            message: 'Artist details retrieved successfully.',
            artist: result[0],
        });
    });
});

app.get('/albumInfo/:albumID', (req, res) => {
    const albumID = req.params.albumID; // albumID provided in the request

    // Query to get album details
    const query = `SELECT albumID, artistName, dateCreated FROM album WHERE albumID = ?`;

    db.query(query, [albumID], (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve album details.', details: err.message });
        }

        // Check if the album exists
        if (result.length === 0) {
            return res.status(404).json({ message: 'Album not found.' });
        }

        // Return the album's details
        res.status(200).json({
            message: 'Album details retrieved successfully.',
            album: result[0],
        });
    });
});

app.get('/playlistInfo/:playlistID', (req, res) => {
    const playlistID = req.params.playlistID; // PlaylistID provided in the request

    // Query to get playlist details including MediaIDs
    const query = `
        SELECT 
            p.PlaylistID, 
            p.Description, 
            p.Creator, 
            p.DateAdded, 
            GROUP_CONCAT(p.MediaID) AS MediaIDs
        FROM 
            playlist p
        WHERE 
            p.PlaylistID = ?
        GROUP BY 
            p.PlaylistID, p.Description, p.Creator, p.DateAdded
    `;

    db.query(query, [playlistID], (err, result) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve playlist details.', details: err.message });
        }

        // Check if the playlist exists
        if (result.length === 0) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        // Return the playlist's details
        res.status(200).json({
            message: 'Playlist details retrieved successfully.',
            playlist: result[0],
        });
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});