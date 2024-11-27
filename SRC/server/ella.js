const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shadowflash1",
    database: "BRATmusic",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to the MySQL database.");
    }
});

// API endpoint to register a new user
app.post("/register", async (req, res) => {
    const {
        UserID,
        DisplayName,
        StartDateOfSubscription,
        Password,
        SubscriptionType,
        PlaylistLibraryID,
    } = req.body;

    if (!UserID || !Password || !DisplayName) {
        return res
            .status(400)
            .json({ message: "UserID, Password, and DisplayName are required." });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Generate a default PlaylistID
        const defaultPlaylistID = Math.floor(Math.random() * 1000000); // Example: Random ID

        // Step 1: Insert into the userplaylistlibrary table
        const insertPlaylistLibraryQuery = `
            INSERT INTO userplaylistlibrary (LibraryID, PlaylistID)
            VALUES (?, ?)
        `;

        db.query(
            insertPlaylistLibraryQuery,
            [PlaylistLibraryID, defaultPlaylistID],
            (err, result) => {
                if (err) {
                    console.error("Error inserting into userplaylistlibrary:", err);
                    return res
                        .status(500)
                        .json({ message: "Failed to create PlaylistLibraryID." });
                }

                // Step 2: Insert the user into the user table
                const insertUserQuery = `
                    INSERT INTO user (UserID, DisplayName, StartDateOfSubscription, Password, SubscriptionType, PlaylistLibraryID)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    insertUserQuery,
                    [
                        UserID,
                        DisplayName,
                        StartDateOfSubscription || null,
                        hashedPassword,
                        SubscriptionType || null,
                        PlaylistLibraryID,
                    ],
                    (err, result) => {
                        if (err) {
                            console.error("Error inserting user:", err);
                            return res
                                .status(500)
                                .json({ message: "Registration failed." });
                        }

                        res
                            .status(201)
                            .json({ message: "User registered successfully." });
                    }
                );
            }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error." });
    }
});

app.post("/insert-song", async (req, res) => {
    const {
        mediaID,
        mediaName,
        mediaFile,
        totalDurationListenedTo,
        mediaRanking,
        dateCreated,
        lengthOfMedia,
        albumID,
        artistName,
    } = req.body;

    // Ensure required fields are provided
    if (!mediaID || !mediaName || !artistName || !dateCreated || !lengthOfMedia) {
        return res.status(400).json({
            message: "mediaID, mediaName, artistName, dateCreated, and lengthOfMedia are required.",
        });
    }

    try {
        // Step 1: Validate that the artist exists
        const artistCheckQuery = "SELECT * FROM Artist WHERE artistName = ?";
        db.query(artistCheckQuery, [artistName], (err, result) => {
            if (err) {
                console.error("Error checking artist:", err);
                return res.status(500).json({ message: "Server error." });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Artist not found." });
            }

            // Step 2: Insert the song into the Media table
            const insertSongQuery = `
            INSERT INTO media (mediaName, mediaFile, totalDurationListenedTo, mediaRanking, dateCreated, lengthOfMedia, albumID, artistName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSongQuery,
                [
                    mediaName,
                    mediaFile || null,
                    totalDurationListenedTo || 0,
                    mediaRanking || null,
                    dateCreated,
                    lengthOfMedia,
                    albumID || null,
                    artistName,
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting song:", err);
                        return res.status(500).json({ message: "Error inserting song." });
                    }
                    res.status(201).json({ message: "Song inserted successfully.", mediaID: result.insertId });
                }
            );

        });
    } catch (error) {
        console.error("Error during song insertion:", error);
        res.status(500).json({ message: "Server error." });
    }
});

app.post("/insert-song-to-playlist", async (req, res) => {
    const { PlaylistID, MediaID, DateAdded, Description, Creator } = req.body;

    // Validate required fields
    if (!PlaylistID || !MediaID || !DateAdded || !Creator) {
        return res.status(400).json({
            message: "PlaylistID, MediaID, DateAdded, and Creator are required.",
        });
    }

    try {
        // Step 1: Validate that the playlist exists
        const playlistCheckQuery = "SELECT * FROM playlist WHERE PlaylistID = ?";
        db.query(playlistCheckQuery, [PlaylistID], (err, playlistResult) => {
            if (err) {
                console.error("Error checking playlist:", err);
                return res.status(500).json({ message: "Server error." });
            }

            if (playlistResult.length === 0) {
                return res.status(404).json({ message: "Playlist not found." });
            }

            // Step 2: Validate that the song exists
            const songCheckQuery = "SELECT * FROM media WHERE mediaID = ?";
            db.query(songCheckQuery, [MediaID], (err, songResult) => {
                if (err) {
                    console.error("Error checking song:", err);
                    return res.status(500).json({ message: "Server error." });
                }

                if (songResult.length === 0) {
                    return res.status(404).json({ message: "Song not found." });
                }

                // Step 3: Insert the song into the playlist
                const insertQuery = `
                    INSERT INTO playlist (PlaylistID, MediaID, DateAdded, Description, Creator)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(
                    insertQuery,
                    [PlaylistID, MediaID, DateAdded, Description || null, Creator],
                    (err, result) => {
                        if (err) {
                            console.error("Error inserting song into playlist:", err);
                            return res
                                .status(500)
                                .json({ message: "Failed to insert song into playlist." });
                        }

                        res.status(201).json({ message: "Song added to playlist successfully." });
                    }
                );
            });
        });
    } catch (error) {
        console.error("Error during song insertion:", error);
        res.status(500).json({ message: "Server error." });
    }
});

app.get("/playlist-songs/:PlaylistID", (req, res) => {
    const { PlaylistID } = req.params;

    // Validate that PlaylistID is provided
    if (!PlaylistID) {
        return res.status(400).json({ message: "PlaylistID is required." });
    }

    // SQL query to fetch songs of a playlist
    const query = `
    SELECT 
        p.MediaID,
        m.mediaName,
        CONCAT('http://localhost:3001/stream/', m.mediaID) AS streamURL,
        m.lengthOfMedia,
        p.DateAdded,
        p.Description
    FROM 
        playlist p
    INNER JOIN 
        media m ON p.MediaID = m.mediaID
    WHERE 
        p.PlaylistID = ?
`;


    db.query(query, [PlaylistID], (err, results) => {
            if (err) {
                console.error("Error fetching playlist songs:", err);
                return res.status(500).json({ message: "Server error." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "No songs found for this playlist." });
            }

            res.status(200).json({
                message: "Songs retrieved successfully.",
                songs: results,
            });
        });
});

app.get("/stream/:MediaID", (req, res) => {
    const { MediaID } = req.params;

    if (!MediaID) {
        return res.status(400).json({ message: "MediaID is required." });
    }

    // SQL query to fetch the binary music file
    const query = `
        SELECT mediaFile, mediaName
        FROM media
        WHERE mediaID = ?
    `;

    db.query(query, [MediaID], (err, results) => {
        if (err) {
            console.error("Error fetching media file:", err);
            return res.status(500).json({ message: "Server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Media file not found." });
        }

        const mediaFile = results[0].mediaFile; // Binary data
        const mediaName = results[0].mediaName; // Name of the media file

        // Set headers for streaming the audio file
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${mediaName}"`
        );

        // Send the binary data as the response
        res.end(mediaFile);
    });
});

app.delete("/delete-song-from-playlist", (req, res) => {
    const { PlaylistID, MediaID, Creator } = req.body;

    // Validate required fields
    if (!PlaylistID || !MediaID || !Creator) {
        return res.status(400).json({
            message: "PlaylistID, MediaID, and Creator are required.",
        });
    }

    try {
        // Step 1: Check if the playlist exists and belongs to the Creator
        const checkQuery = `
            SELECT * FROM playlist
            WHERE PlaylistID = ? AND Creator = ?
        `;
        db.query(checkQuery, [PlaylistID, Creator], (err, playlistResult) => {
            if (err) {
                console.error("Error checking playlist:", err);
                return res.status(500).json({ message: "Server error." });
            }

            if (playlistResult.length === 0) {
                return res
                    .status(404)
                    .json({ message: "Playlist not found or unauthorized access." });
            }

            // Step 2: Delete the song from the playlist
            const deleteQuery = `
                DELETE FROM playlist
                WHERE PlaylistID = ? AND MediaID = ?
            `;
            db.query(deleteQuery, [PlaylistID, MediaID], (err, deleteResult) => {
                if (err) {
                    console.error("Error deleting song:", err);
                    return res
                        .status(500)
                        .json({ message: "Failed to delete the song from playlist." });
                }

                if (deleteResult.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Song not found in the playlist.",
                    });
                }

                res.status(200).json({
                    message: "Song deleted from playlist successfully.",
                });
            });
        });
    } catch (error) {
        console.error("Error during song deletion:", error);
        res.status(500).json({ message: "Server error." });
    }
});

app.delete("/delete-song-as-artist", (req, res) => {
    const { MediaID, ArtistName } = req.body;

    // Validate required fields
    if (!MediaID || !ArtistName) {
        return res.status(400).json({
            message: "MediaID and ArtistName are required.",
        });
    }

    try {
        // Step 1: Check if the song exists and belongs to the artist
        const checkQuery = `
            SELECT * FROM media
            WHERE mediaID = ? AND artistName = ?
        `;
        db.query(checkQuery, [MediaID, ArtistName], (err, mediaResult) => {
            if (err) {
                console.error("Error checking media:", err);
                return res.status(500).json({ message: "Server error." });
            }

            if (mediaResult.length === 0) {
                return res.status(404).json({
                    message: "Song not found or you do not have permission to delete it.",
                });
            }

            // Step 2: Delete the song from the media table
            const deleteQuery = `
                DELETE FROM media
                WHERE mediaID = ?
            `;
            db.query(deleteQuery, [MediaID], (err, deleteResult) => {
                if (err) {
                    console.error("Error deleting song:", err);
                    return res
                        .status(500)
                        .json({ message: "Failed to delete the song." });
                }

                res.status(200).json({
                    message: "Song deleted successfully.",
                });
            });
        });
    } catch (error) {
        console.error("Error during song deletion:", error);
        res.status(500).json({ message: "Server error." });
    }
});

app.get("/search-song", (req, res) => {
    const { mediaName, artistName, albumID } = req.query;

    let query = `
        SELECT 
            mediaID,
            mediaName,
            artistName,
            albumID,
            lengthOfMedia,
            mediaRanking,
            dateCreated
        FROM media
        WHERE 1 = 1
    `;

    const queryParams = [];

    if (mediaName) {
        query += " AND mediaName LIKE ?";
        queryParams.push(`%${mediaName}%`);
    }

    if (artistName) {
        // Exact match with case insensitivity
        query += " AND LOWER(artistName) = LOWER(?)";
        queryParams.push(artistName);
    }

    if (albumID) {
        query += " AND albumID = ?";
        queryParams.push(albumID);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error searching for songs:", err);
            return res.status(500).json({ message: "Server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No songs found." });
        }

        res.status(200).json({
            message: "Songs retrieved successfully.",
            songs: results,
        });
    });
});



// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
