import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import backgroundImage from "../img/back.png"; // Replace with your actual background image

const SearchAlbum = () => {
  const [albumID, setAlbumID] = useState(""); // State for the album ID input
  const [albums, setAlbums] = useState([]); // State for all albums
  const [selectedAlbum, setSelectedAlbum] = useState(null); // State for selected album details
  const [error, setError] = useState(""); // State for error messages

  // Fetch all albums on component mount
  useEffect(() => {
    const fetchAllAlbums = async () => {
      try {
        const response = await axios.get("/api/albums"); // Replace with your endpoint for fetching all albums
        setAlbums(response.data.albums || []);
      } catch (err) {
        console.error("Error fetching albums:", err);
        setError("Failed to fetch albums. Please try again later.");
      }
    };

    fetchAllAlbums();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSelectedAlbum(null); // Clear previously selected album

    if (!albumID) {
      setError("Please enter an Album ID to search.");
      return;
    }

    try {
      const response = await axios.get(`/api/albumInfo/${albumID}`);
      setSelectedAlbum(response.data.album); // Update the selected album state
    } catch (err) {
      console.error("Error fetching album details:", err);
      setError(err.response?.data?.message || "Failed to fetch album details.");
    }
  };

  const styles = {
    page: {
      minHeight: "80vh",
      height: "auto",
      width: "100vw",
      background: `
        linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
        url(${backgroundImage})
      `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      padding: "20px",
      marginTop: "60px",
    },
    searchContainer: {
      marginTop: "20px",
      width: "80%",
      maxWidth: "600px",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    searchButton: {
      backgroundColor: "#a5ff00",
      color: "black",
      fontSize: "1rem",
      fontWeight: "bold",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    resultContainer: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
      width: "80%",
      maxWidth: "600px",
      textAlign: "center",
    },
    albumList: {
      marginTop: "20px",
      width: "80%",
      maxWidth: "600px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
      padding: "10px",
    },
    albumItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    },
    albumDetails: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
      width: "80%",
      maxWidth: "600px",
      textAlign: "center",
    },
    errorMessage: {
      color: "red",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.page}>
      <UserHeader />
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Album ID..."
            style={styles.searchInput}
            value={albumID}
            onChange={(e) => setAlbumID(e.target.value)}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </div>
      {error && <p style={styles.errorMessage}>{error}</p>}
      {selectedAlbum ? (
        <div style={styles.albumDetails}>
          <h2>Album Details</h2>
          <p>
            <strong>Album ID:</strong> {selectedAlbum.albumID}
          </p>
          <p>
            <strong>Artist Name:</strong> {selectedAlbum.artistName}
          </p>
          <p>
            <strong>Date Created:</strong>{" "}
            {new Date(selectedAlbum.dateCreated).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div style={styles.albumList}>
          <h2>All Albums</h2>
          {albums.length > 0 ? (
            albums.map((album, index) => (
              <div key={index} style={styles.albumItem}>
                <span>
                  <strong>Album ID:</strong> {album.albumID}
                </span>
                <span>
                  <strong>Artist:</strong> {album.artistName}
                </span>
              </div>
            ))
          ) : (
            <p>No albums available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAlbum;

