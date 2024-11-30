const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
app.use(bodyParser.json());
const moment = require('moment');

const cors = require('cors');
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Omar824?",
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
    console.log("Received registration request:", req.body);
   
    const {
        UserID,
        DisplayName,
        Password,
    } = req.body;
 
 
    if (!UserID || !Password || !DisplayName) {
        return res.status(400).json({
            message: "UserID, Password, and DisplayName are required."
        });
    }
 
 
    try {
        // First check if user already exists
        const checkUserQuery = "SELECT UserID FROM user WHERE UserID = ?";
        db.query(checkUserQuery, [UserID], async (checkErr, checkResults) => {
            if (checkErr) {
                console.error("Error checking existing user:", checkErr);
                return res.status(500).json({
                    message: "Error checking user existence."
                });
            }
 
 
            if (checkResults.length > 0) {
                return res.status(409).json({
                    message: "User already exists."
                });
            }
 
 
            // Function to generate unique ID
            const generateUniqueID = async () => {
                let id;
                let exists = true;
                while (exists) {
                    id = Math.floor(Math.random() * 1000000);
                    const [rows] = await db.promise().query(
                        'SELECT LibraryID FROM userplaylistlibrary WHERE LibraryID = ?',
                        [id]
                    );
                    exists = rows.length > 0;
                }
                return id;
            };
 
 
            try {
                // Generate unique IDs
                const PlaylistLibraryID = await generateUniqueID();
                const PlaylistID = await generateUniqueID();
 
 
                // Use a transaction to ensure data consistency
                await db.promise().beginTransaction();
 
 
                // Insert into userplaylistlibrary
                await db.promise().query(
                    'INSERT INTO userplaylistlibrary (LibraryID, PlaylistID) VALUES (?, ?)',
                    [PlaylistLibraryID, PlaylistID]
                );
 
 
                // Insert the user
                await db.promise().query(
                    'INSERT INTO user (UserID, DisplayName, Password, PlaylistLibraryID) VALUES (?, ?, ?, ?)',
                    [UserID, DisplayName, Password, PlaylistLibraryID]
                );
 
 
                await db.promise().commit();
 
 
                res.status(201).json({
                    message: "User registered successfully",
                    userId: UserID
                });
 
 
            } catch (transactionError) {
                await db.promise().rollback();
                console.error("Transaction error:", transactionError);
                res.status(500).json({
                    message: "Registration failed. Please try again."
                });
            }
        });
    } catch (error) {
        console.error("Server error during registration:", error);
        res.status(500).json({ message: "Server error." });
    }
 });

 


   // API endpoint to register a new artist
   app.post("/api/register-artist", async (req, res) => {
    console.log("Received artist registration request:", req.body);  // Debug log
   
    const {
        artistName,
        email,
        password,
        totalDurationListenedTo = 0,
        revenueGenerated = 0
    } = req.body;

    // Input validation
    if (!artistName || !email || !password) {
        console.log("Missing required fields");  // Debug log
        return res.status(400).json({
            message: "artistName, email, and password are required fields."
        });
    }

    try {
        // Check if artist already exists
        const checkArtistQuery = "SELECT * FROM artist WHERE artistName = ? OR email = ?";
        db.query(checkArtistQuery, [artistName, email], async (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({
                    message: "Error checking artist existence.",
                    error: err.message
                });
            }

            if (results.length > 0) {
                console.log("Artist already exists");  // Debug log
                return res.status(409).json({
                    message: "Artist with this name or email already exists."
                });
            }

            // Insert new artist
            const insertQuery = `
                INSERT INTO artist (
                    artistName,
                    totalDurationListenedTo,
                    revenueGenerated,
                    email,
                    password
                ) VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [
                    artistName,
                    totalDurationListenedTo,
                    revenueGenerated,
                    email,
                    password  // Store password directly
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error registering artist:", err);
                        return res.status(500).json({
                            message: "Artist registration failed.",
                            error: err.message
                        });
                    }

                    console.log("Artist registered successfully");  // Debug log

                    // Generate JWT token for the newly registered artist
                    const token = jwt.sign(
                        {
                            artistName: artistName,
                            email: email,
                            role: 'artist'
                        },
                        JWT_SECRET
                    );

                    res.status(201).json({
                        message: "Artist registered successfully.",
                        token: token,
                        artist: {
                            artistName: artistName,
                            email: email,
                            totalDurationListenedTo: totalDurationListenedTo,
                            revenueGenerated: revenueGenerated
                        }
                    });
                }
            );
        });
    } catch (error) {
        console.error("Error during artist registration:", error);
        res.status(500).json({
            message: "Server error during registration.",
            error: error.message
        });
    }
});

app.post("/api/insert-song", async (req, res) => {
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

app.post("/api/insert-song-to-playlist", async (req, res) => {
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


app.get("/api/playlist-songs/:PlaylistID", (req, res) => {
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

app.get("/api/stream/:MediaID", (req, res) => {
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

app.delete("/api/delete-song-from-playlist", (req, res) => {
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

app.delete("/api/delete-song-as-artist", (req, res) => {
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

app.get("/api/search-song", (req, res) => {
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
    `;

    const queryParams = [];

    if (mediaName || artistName || albumID) {
        query += " WHERE 1 = 1";

        if (mediaName) {
            query += " AND mediaName LIKE ?";
            queryParams.push(`%${mediaName}%`);
        }

        if (artistName) {
            query += " AND LOWER(artistName) = LOWER(?)";
            queryParams.push(artistName);
        }

        if (albumID) {
            query += " AND albumID = ?";
            queryParams.push(albumID);
        }
    }

    console.log("Executing SQL Query:", query);
    console.log("Query Params:", queryParams);

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ message: "Server error.", error: err });
        }

        if (results.length === 0) {
            console.log("No songs found.");
            return res.status(404).json({ message: "No songs found." });
        }

        console.log("Songs Retrieved:", results);
        res.status(200).json({ message: "Songs retrieved successfully.", songs: results });
    });
});

  




app.post('/api/createPlaylist', (req, res) => {
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

app.post('/api/createAlbum', (req, res) => {
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


app.delete('/api/deleteAlbum/:albumID', (req, res) => {
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
app.delete('/api/deletePlaylist/:playlistID', (req, res) => {
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

app.get('/api/userInfo/:email', (req, res) => {
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

app.get('/api/artistInfo/:artistName', (req, res) => {
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

app.get('/api/albumInfo/:albumID', (req, res) => {
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

app.get('/api/playlistInfo/:playlistID', (req, res) => {
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

const JWT_SECRET = 'your-secret-key'; // Replace with a strong secret key

// Check database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('Database connected successfully!');
  }
});

// Generate and log a JWT token at startup
const sampleUser = {
  UserID: 'aaliyah@bratmusic.com',
  DisplayName: 'Aaliyah'
};
const token = jwt.sign(sampleUser, JWT_SECRET); // Generate token
console.log('Sample JWT Token:', token); // Log token to terminal

// Login API with JWT
// Login API using GET (not recommended)
app.get('/api/login', (req, res) => {
    const { UserID, Password } = req.query; // Use query parameters for GET requests
  
    // Input validation
    if (!UserID || !Password) {
      return res.status(400).json({ error: 'UserID and Password are required.' });
    }
  
    // Query to find user by UserID
    const query = `SELECT * FROM user WHERE UserID = ?`;
    db.query(query, [UserID], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
  
      // Check if user exists
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid UserID or Password.' });
      }
  
      const user = results[0];
  
      // Directly compare the passwords
      if (Password !== user.Password) {
        return res.status(401).json({ error: 'Invalid UserID or Password.' });
      }
  
      // Generate JWT
      const token = jwt.sign(
        { UserID: user.UserID, DisplayName: user.DisplayName },
        JWT_SECRET
      );
  
      // Log the token in the terminal
      console.log('Generated JWT Token:', token);
  
      // Send the token back to the client
      res.status(200).json({
        message: 'Login successful.',
        token: token,
        user: { UserID: user.UserID, DisplayName: user.DisplayName }
      });
    });
  });
  
app.get("/api/playlists", (req, res) => {
    const { Description, Creator } = req.query;

    if (!Description && !Creator) {
        return res.status(400).json({ error: "At least one query parameter is required" });
    }

    let query = "SELECT * FROM playlist WHERE";
    const params = [];

    if (Description) {
        query += " Description LIKE ?";
        params.push(`%${Description}%`);
    }

    if (Creator) {
        if (params.length > 0) query += " AND";
        query += " Creator LIKE ?";
        params.push(`%${Creator}%`);
    }

    console.log("Executing Query:", query, "with Params:", params);

    // Execute the query
    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal Server Error" }); // Ensure response is returned
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No playlists found" }); // Ensure response is returned
        }

        // If we reach here, results exist
        res.status(200).json(results); // Ensure response is returned only once
    });
});


// Endpoint to search for an artist by artistName
app.get("/api/artist", (req, res) => {
    const { artistName } = req.query;

    if (artistName) {
        console.log(`Searching for artist: ${artistName}`);
        const query = "SELECT * FROM artist WHERE artistName LIKE ?";
        db.query(query, [`%${artistName}%`], (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (results.length === 0) {
                console.log("No artists found.");
                return res.status(404).json({ message: "No artists found" });
            }

            console.log("Artists found:", results);
            res.status(200).json(results);
        });
    } else {
        console.log("Fetching all artists.");
        const query = "SELECT * FROM artist";
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            console.log("All artists:", results);
            res.status(200).json(results);
        });
    }
});






// Login API with JWT
// Login API using GET (not recommended)
app.get('/api/login', (req, res) => {
   const { UserID, Password } = req.query; // Use query parameters for GET requests
    // Input validation
   if (!UserID || !Password) {
     return res.status(400).json({ error: 'UserID and Password are required.' });
   }
    // Query to find user by UserID
   const query = `SELECT * FROM user WHERE UserID = ?`;
   db.query(query, [UserID], (err, results) => {
     if (err) {
       console.error('Database query error:', err);
       return res.status(500).json({ error: 'Database error.' });
     }
      // Check if user exists
     if (results.length === 0) {
       return res.status(401).json({ error: 'Invalid UserID or Password.' });
     }
      const user = results[0];
      // Directly compare the passwords
     if (Password !== user.Password) {
       return res.status(401).json({ error: 'Invalid UserID or Password.' });
     }
      // Generate JWT
     const token = jwt.sign(
       { UserID: user.UserID, DisplayName: user.DisplayName },
       JWT_SECRET
     );
      // Log the token in the terminal
     console.log('Generated JWT Token:', token);
      // Send the token back to the client
     res.status(200).json({
       message: 'Login successful.',
       token: token,
       user: { UserID: user.UserID, DisplayName: user.DisplayName }
     });
   });
 });
  // Artist Login API using GET
app.get('/api/artist-login', (req, res) => {
 const { email, password } = req.query; // Extract email and password from query parameters


 // Input validation
 if (!email || !password) {
   return res.status(400).json({ error: 'Email and Password are required.' });
 }


 // Query to find artist by email in the artist table
 const query = `SELECT * FROM artist WHERE email = ?`;
 db.query(query, [email], (err, results) => {
   if (err) {
     console.error('Database query error:', err);
     return res.status(500).json({ error: 'Database error.' });
   }


   // Check if artist exists
   if (results.length === 0) {
     return res.status(401).json({ error: 'Invalid Email or Password.' });
   }


   const artist = results[0];


   // Validate password
   if (password !== artist.password) {
     return res.status(401).json({ error: 'Invalid Email or Password.' });
   }


   // Generate JWT for the artist
   const token = jwt.sign(
     { artistName: artist.artistName, email: artist.email, role: 'artist' },
     JWT_SECRET // No expiration for the token
   );


   // Send the token and artist details back to the client
   res.status(200).json({
     message: 'Artist login successful.',
     token: token,
     artist: {
       artistName: artist.artistName,
       email: artist.email,
       revenueGenerated: artist.revenueGenerated,
       totalDurationListened: artist.totalDurationListened
     }
   });
 });
});


/************************************************************************************************************
*  End point to increment stream count for the user listening stats -SARAH ************************************************************************************************************/
app.post('/api/increment-stream', (req, res) =>
    {
     const { userID, mediaID } = req.body;
    
    
     if (!userID || !mediaID)
     {
       return res.status(400).json({ error: 'userID and mediaID are required' });
     }
    
    
     // First check if record exists
     const checkQuery = 'SELECT * FROM listeningstats WHERE userID = ? AND mediaID = ?';
    
    
     db.query(checkQuery, [userID, mediaID], (err, results) =>
     {
       if (err)
       {
         console.error('Database query error:', err);
         return res.status(500).json({ error: 'Database error', details: err.message });
       }
    
    
       if (results.length > 0)
       {
         // Record exists, update duration
         const updateQuery = 'UPDATE listeningstats SET duration = duration + 1 WHERE userID = ? AND mediaID = ?';
    
    
         db.query(updateQuery, [userID, mediaID], (err) =>
         {
           if (err)
           {
             console.error('Update error:', err);
             return res.status(500).json({ error: 'Error updating stream count', details: err.message });
           }
    
    
           res.json({
             success: true,
             message: 'Stream count incremented'
           });
         });
       } else
       {
         // Record doesn't exist, insert new one
         const insertQuery = 'INSERT INTO listeningstats (userID, mediaID, duration) VALUES (?, ?, 1)';
    
    
         db.query(insertQuery, [userID, mediaID], (err) =>
         {
           if (err)
           {
             console.error('Insert error:', err);
             return res.status(500).json({ error: 'Error creating new stream record', details: err.message });
           }
    
    
           res.json({
             success: true,
             message: 'New stream record created'
           });
         });
       }
     });
    });
    
    
    /************************************************************************************************************
    *  End point to get listening stats for the user -SARAH ************************************************************************************************************/
    app.get('/api/user-streams/:userID', (req, res) =>
    {
     const userID = req.params.userID;
    
    
     const query = `
           SELECT mediaID, duration as streamCount
           FROM listeningstats
           WHERE userID = ?
           ORDER BY duration DESC
       `;
    
    
     db.query(query, [userID], (err, results) =>
     {
       if (err)
       {
         console.error('Database query error:', err);
         return res.status(500).json({
           error: 'Error fetching stream counts',
           details: err.message
         });
       }
    
    
       res.json({
         success: true,
         userID: userID,
         streams: results
       });
     });
    });
    
    
    /************************************************************************************************************
    *  End point to get a media's total streams -SARAH ************************************************************************************************************/
    app.get('/api/total-streams/:mediaID', (req, res) =>
    {
     const mediaID = req.params.mediaID;
    
    
     const query = `
           SELECT
               COUNT(DISTINCT userID) as uniqueListeners,
               SUM(duration) as totalStreams
           FROM listeningstats
           WHERE mediaID = ?
       `;
    
    
     db.query(query, [mediaID], (err, results) =>
     {
       if (err)
       {
         console.error('Database query error:', err);
         return res.status(500).json({
           error: 'Error fetching total streams',
           details: err.message
         });
       }
    
    
       const stats = results[0]; // Get the first (and only) result
    
    
       res.json({
         success: true,
         mediaID: mediaID,
         totalStreams: stats.totalStreams || 0,
         uniqueListeners: stats.uniqueListeners || 0
       });
     });
    });
    
    
    /************************************************************************************************************
    *  End point to get an artist's total streams -SARAH ************************************************************************************************************/
    app.post('/api/artist-total-streams', (req, res) =>
    {
     const { artistName } = req.body;
    
    
     if (!artistName)
     {
       return res.status(400).json({
         error: 'Artist name is required in request body'
       });
     }
    
    
     const query = `
           SELECT
               m.artistName,
               COUNT(DISTINCT l.userID) as uniqueListeners,
               SUM(l.duration) as totalStreams
           FROM media m
           JOIN listeningstats l ON m.mediaID = l.mediaID
           WHERE m.artistName = ?
           GROUP BY m.artistName
       `;
    
    
     db.query(query, [artistName], (err, results) =>
     {
       if (err)
       {
         console.error('Database query error:', err);
         return res.status(500).json({
           error: 'Error fetching artist streams',
           details: err.message
         });
       }
    
    
       // If no results found, return 0s
       const stats = results[0] || {
         artistName: artistName,
         uniqueListeners: 0,
         totalStreams: 0
       };
    
    
       res.json({
         success: true,
         artistName: stats.artistName,
         totalStreams: stats.totalStreams || 0,
         uniqueListeners: stats.uniqueListeners || 0
       });
     });
    });
    
    
/************************************************************************************************************
*  End point to get total revenue for artist from table-SARAH ************************************************************************************************************/


app.post('/api/artist-revenue', (req, res) =>
{
    const { email } = req.body;

    if (!email)
    {
        return res.status(400).json({
            error: 'Artist email is required in request body'
        });
    }

    const query = `
    SELECT revenueGenerated 
    FROM Artist 
    WHERE email = ?
  `;

    db.query(query, [email], (err, results) =>
    {
        if (err)
        {
            console.error('Database query error:', err);
            return res.status(500).json({
                error: 'Error fetching artist revenue',
                details: err.message
            });
        }

        // If no results found, return 0
        const revenue = results[0]?.revenueGenerated || 0;

        res.json({
            success: true,
            email: email,
            revenueGenerated: revenue
        });
    });
});

/************************************************************************************************************
   *  End point to get artist name -SARAH ************************************************************************************************************/

app.post('/api/get-artist-name', (req, res) =>
{
    const { email } = req.body;

    if (!email)
    {
        return res.status(400).json({ error: 'Email is required.' });
    }

    const query = 'SELECT artistName FROM artist WHERE email = ?';

    db.query(query, [email], (err, results) =>
    {
        if (err)
        {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (results.length === 0)
        {
            return res.status(404).json({ error: 'Artist not found' });
        }

        res.json({ artistName: results[0].artistName });
    });
});
    /************************************************************************************************************
    *  End point to get total revenue generated for artist -SARAH ************************************************************************************************************/
    app.post('/api/calculate-revenue', (req, res) =>
    {
     const { artistName } = req.body;
     const REVENUE_PER_STREAM = 0.45; // assumption = $0.45 per stream
    
    
     if (!artistName)
     {
       return res.status(400).json({
         error: 'Artist name is required in request body'
       });
     }
    
    
     const query = `
           SELECT
               m.artistName,
               SUM(l.duration) as totalStreams
           FROM media m
           JOIN listeningstats l ON m.mediaID = l.mediaID
           WHERE m.artistName = ?
           GROUP BY m.artistName
       `;
    
    
     db.query(query, [artistName], (err, results) =>
     {
       if (err)
       {
         console.error('Database query error:', err);
         return res.status(500).json({
           error: 'Error calculating revenue',
           details: err.message
         });
       }
    
    
       // If no results found, return 0s
       const stats = results[0] || {
         artistName: artistName,
         totalStreams: 0
       };
    
    
       const revenue = stats.totalStreams * REVENUE_PER_STREAM;
    
    
       res.json({
         success: true,
         artistName: stats.artistName,
         totalStreams: stats.totalStreams || 0,
         revenuePerStream: REVENUE_PER_STREAM,
         totalRevenue: revenue || 0
       });
     });
    });

    app.use((req, res, next) => {
        req.loggedInArtist = "exampleArtistName"; // Replace with the actual logged-in artist logic
        next();
    });
    
    app.post("/api/createEvent", (req, res) => {
        const { eventID, eventDate, eventTime, location } = req.body;
        const artistName = req.body.artistName || req.loggedInArtist;
    
        if (!artistName || !eventID || !eventDate || !eventTime || !location) {
            return res.status(400).json({
                error: "Missing required fields: eventID, artistName, eventDate, eventTime, or location",
            });
        }
    
        // Check if eventID is unique
        const checkEventQuery = `SELECT * FROM eventcalendar WHERE eventID = ?`;
        db.query(checkEventQuery, [eventID], (err, result) => {
            if (err) {
                console.error("Error checking event ID:", err.message);
                return res.status(500).json({ error: "Failed to validate event ID", details: err.message });
            }
    
            if (result.length > 0) {
                return res.status(400).json({ error: "Event ID already exists. Please choose a different name." });
            }
    
            // Insert the new event if eventID is unique
            const insertEventQuery = `
                INSERT INTO eventcalendar (eventID, artistName, eventDate, eventTime, location) 
                VALUES (?, ?, ?, ?, ?)
            `;
            console.log("SQL Query:", insertEventQuery);
            console.log("Values:", [eventID, artistName, eventDate, eventTime, location]);
    
            db.query(insertEventQuery, [eventID, artistName, eventDate, eventTime, location], (err, result) => {
                if (err) {
                    console.error("Error inserting event:", err.message);
                    return res.status(500).json({ error: "Failed to create event", details: err.message });
                }
    
                res.status(201).json({
                    message: "Event created successfully",
                    eventID: eventID,
                });
            });
        });
    });
    
    
    
    app.get("/api/events", (req, res) => {
        const sql = `
            SELECT eventID, artistName, eventDate, eventTime, location 
            FROM eventcalendar
        `;
    
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching events:", err);
                return res.status(500).json({ error: "Failed to fetch events" });
            }
    
            // Format the eventDate to YYYY-MM-DD
            const formattedResults = results.map(event => ({
                ...event,
                eventDate: moment(event.eventDate).format("YYYY-MM-DD"),
            }));
    
            res.status(200).json({
                message: "Events retrieved successfully",
                events: formattedResults,
            });
        });
    });
    
    app.get('/api/advertisement/:adId', (req, res) => {
        const adId = req.params.adId;
    
        // SQL query to fetch the company name and ad file
        const sql = `SELECT company, adFile FROM advertisement WHERE adId = ?`;
    
        db.query(sql, [adId], (err, results) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ error: 'Failed to fetch advertisement details.', details: err.message });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ error: 'Advertisement not found.' });
            }
    
            // Retrieve the advertisement details
            const advertisement = results[0];
    
            // Send the advertisement response
            res.status(200).json({
                company: advertisement.company,
                adFile: Buffer.from(advertisement.adFile).toString('base64'), // Send adFile as Base64 for playback
            });
        });
    });

    app.use((req, res, next) => {
        req.loggedInArtist = "exampleArtistName"; // Replace with the actual logged-in artist logic
        next();
    });
    
    app.post("/api/createEvent", (req, res) => {
        const { eventID, eventDate, eventTime, location } = req.body;
        const artistName = req.body.artistName || req.loggedInArtist;
    
        if (!artistName || !eventID || !eventDate || !eventTime || !location) {
            return res.status(400).json({
                error: "Missing required fields: eventID, artistName, eventDate, eventTime, or location",
            });
        }
    
        // Check if eventID is unique
        const checkEventQuery = `SELECT * FROM eventcalendar WHERE eventID = ?`;
        db.query(checkEventQuery, [eventID], (err, result) => {
            if (err) {
                console.error("Error checking event ID:", err.message);
                return res.status(500).json({ error: "Failed to validate event ID", details: err.message });
            }
    
            if (result.length > 0) {
                return res.status(400).json({ error: "Event ID already exists. Please choose a different name." });
            }
    
            // Insert the new event if eventID is unique
            const insertEventQuery = `
                INSERT INTO eventcalendar (eventID, artistName, eventDate, eventTime, location) 
                VALUES (?, ?, ?, ?, ?)
            `;
            console.log("SQL Query:", insertEventQuery);
            console.log("Values:", [eventID, artistName, eventDate, eventTime, location]);
    
            db.query(insertEventQuery, [eventID, artistName, eventDate, eventTime, location], (err, result) => {
                if (err) {
                    console.error("Error inserting event:", err.message);
                    return res.status(500).json({ error: "Failed to create event", details: err.message });
                }
    
                res.status(201).json({
                    message: "Event created successfully",
                    eventID: eventID,
                });
            });
        });
    });
    
    
    
    app.get("/api/events", (req, res) => {
        const sql = `
            SELECT eventID, artistName, eventDate, eventTime, location 
            FROM eventcalendar
        `;
    
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching events:", err);
                return res.status(500).json({ error: "Failed to fetch events" });
            }
    
            // Format the eventDate to YYYY-MM-DD
            const formattedResults = results.map(event => ({
                ...event,
                eventDate: moment(event.eventDate).format("YYYY-MM-DD"),
            }));
    
            res.status(200).json({
                message: "Events retrieved successfully",
                events: formattedResults,
            });
        });
    });
    
    app.get('/api/advertisement/:adId', (req, res) => {
        const adId = req.params.adId;
    
        // SQL query to fetch the company name and ad file
        const sql = `SELECT company, adFile FROM advertisement WHERE adId = ?`;
    
        db.query(sql, [adId], (err, results) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ error: 'Failed to fetch advertisement details.', details: err.message });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ error: 'Advertisement not found.' });
            }
    
            // Retrieve the advertisement details
            const advertisement = results[0];
    
            // Send the advertisement response
            res.status(200).json({
                company: advertisement.company,
                adFile: Buffer.from(advertisement.adFile).toString('base64'), // Send adFile as Base64 for playback
            });
        });
    });

    app.get('/api/media/details/:albumID', (req, res) => {
        const albumID = req.params.albumID;
        const query = `
            SELECT 
                mediaID,
                mediaName,
                dateCreated,
                lengthOfMedia,
                mediaRanking,
                totalDurationListenedTo
            FROM media
            WHERE albumID = ?
            ORDER BY mediaName
        `;
    
        db.query(query, [albumID], (err, results) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ 
                    error: 'Failed to retrieve media details.',
                    details: err.message 
                });
            }
    
            const formattedResults = results.map(media => ({
                mediaID: media.mediaID,
                mediaName: media.mediaName,
                dateCreated: media.dateCreated,
                lengthOfMedia: media.lengthOfMedia,
                mediaRanking: media.mediaRanking,
                totalDurationListenedTo: media.totalDurationListenedTo
            }));
    
            res.status(200).json({
                message: 'Media details retrieved successfully.',
                media: formattedResults
            });
        });
    });

    app.get('/api/albums/details', (req, res) => {
        const query = `
            SELECT 
                albumID,
                artistName,
                dateCreated
            FROM album
            ORDER BY dateCreated DESC
        `;
    
        db.query(query, (err, results) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.status(500).json({ 
                    error: 'Failed to retrieve album details.',
                    details: err.message 
                });
            }
    
            res.status(200).json({
                message: 'Albums retrieved successfully.',
                albums: results
            });
        });
    });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
