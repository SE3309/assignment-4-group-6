const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Rcgme03301!',
    database: 'bratmusic',
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the MySQL database.");
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//API to edit user info
app.put("/modify-user-info", async (req, res) => {
    const {
        UserID, // Required to identify the user
        DisplayName,
        Password,
        SubscriptionType,
    } = req.body;

    // Ensure the UserID is provided (mandatory for updates)
    if (!UserID) {
        return res.status(400).json({ message: "UserID is required." });
    }

    // Initialize an array of fields to update dynamically
    let updateFields = [];
    let values = [];

    if (DisplayName) {
        updateFields.push("DisplayName = ?");
        values.push(DisplayName);
    }

    if (Password) {
        try {
            const hashedPassword = await bcrypt.hash(Password, 10); // Hash the password
            updateFields.push("Password = ?");
            values.push(hashedPassword);
        } catch (error) {
            console.error("Error hashing password:", error);
            return res.status(500).json({ message: "Error updating password." });
        }
    }

    if (SubscriptionType) {
        updateFields.push("SubscriptionType = ?");
        values.push(SubscriptionType);
    }

    if (updateFields.length === 0) {
        return res
            .status(400)
            .json({ message: "No fields to update were provided." });
    }

    // Add UserID to the values array for the WHERE clause
    values.push(UserID);

    const updateQuery = `
        UPDATE user
        SET ${updateFields.join(", ")}
        WHERE UserID = ?
    `;

    // Execute the query
    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error("Error updating user info:", err);
            return res
                .status(500)
                .json({ message: "Error updating user information." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User information updated successfully." });
    });
});
