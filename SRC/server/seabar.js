// Import required modules
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken'); // JWT for token generation

// Create an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// JWT secret key
const JWT_SECRET = 'your-secret-key'; // Replace with a strong secret key

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Omar824?',
  database: 'BRATmusic',
  port: '3306'
});

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
  
  // Artist Login API using GET
app.get('/artist-login', (req, res) => {
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


  



// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});


/************************************************************************************************************
 *  End point to increment stream count for the user listening stats -SARAH ************************************************************************************************************/
app.post('/increment-stream', (req, res) =>
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
app.get('/user-streams/:userID', (req, res) =>
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
app.get('/total-streams/:mediaID', (req, res) =>
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
app.post('/artist-total-streams', (req, res) =>
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
 *  End point to get total revenue generated for artist -SARAH ************************************************************************************************************/
app.post('/calculate-revenue', (req, res) =>
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