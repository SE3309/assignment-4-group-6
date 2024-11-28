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
    password: "",
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
app.get('/login', (req, res) => {
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

    if (!artistName) {
        return res.status(400).json({ error: "artistName query parameter is required" });
    }

    const query = "SELECT * FROM artist WHERE artistName LIKE ?";
    db.query(query, [`%${artistName}%`], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No artists found" });
        }

        res.status(200).json(results);
    });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
