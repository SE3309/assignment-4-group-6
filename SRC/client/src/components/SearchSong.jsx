import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import axios from "axios"; // Ensure you're using the import syntax
import backgroundImage from "../img/back.png";

const SearchSong = () => {
  const [mediaName, setMediaName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albumID, setAlbumID] = useState("");
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const response = await axios.get("/api/search-song"); // No need for full URL
        console.log("Fetched all songs:", response.data);
        setAllSongs(response.data.songs || []);
      } catch (err) {
        console.error("Error fetching all songs:", err);
        setError("Unable to fetch all songs at the moment.");
      }
    };
    

    fetchAllSongs();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("/api/search-song", {
        params: {
          mediaName,
          artistName,
          albumID,
        },
      });

      setSongs(response.data.songs || []);
      setError("");
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError(err.response?.data?.message || "An error occurred while searching for songs.");
      setSongs([]);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
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
      marginTop: "65px",
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
    },
    results: {
      marginTop: "20px",
      textAlign: "center",
    },
    resultItem: {
      margin: "10px 0",
      fontSize: "1.2rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
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
            placeholder="Search by song name..."
            style={styles.searchInput}
            value={mediaName}
            onChange={(e) => setMediaName(e.target.value)}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      {/* Display Search Results */}
      <div style={styles.results}>
        {error && <p style={styles.errorMessage}>{error}</p>}
        {songs.length > 0 && (
          <div>
            <h2 style={styles.sectionTitle}>Search Results:</h2>
            {songs.map((song, index) => (
              <div key={index} style={styles.resultItem}>
                <p>
                  <strong>Title:</strong> {song.mediaName}
                </p>
                <p>
                  <strong>Artist:</strong> {song.artistName}
                </p>
                <p>
                  <strong>Album ID:</strong> {song.albumID}
                </p>
                <p>
                  <strong>Length:</strong> {song.lengthOfMedia}
                </p>
                <p>
                  <strong>Ranking:</strong> {song.mediaRanking}
                </p>
                <p>
                  <strong>Date Created:</strong> {new Date(song.dateCreated).toLocaleDateString()}
                </p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display All Songs */}
      <div style={styles.results}>
        <h2 style={styles.sectionTitle}>All Songs:</h2>
        {allSongs.length > 0 ? (
          allSongs.map((song, index) => (
            <div key={index} style={styles.resultItem}>
              <p>
                <strong>Title:</strong> {song.mediaName}
              </p>
              <p>
                <strong>Artist:</strong> {song.artistName}
              </p>
              <p>
                <strong>Album ID:</strong> {song.albumID}
              </p>
              <p>
                <strong>Length:</strong> {song.lengthOfMedia}
              </p>
              <p>
                <strong>Ranking:</strong> {song.mediaRanking}
              </p>
              <p>
                <strong>Date Created:</strong> {new Date(song.dateCreated).toLocaleDateString()}
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>No songs available.</p>
        )}
      </div>
    </div>
  );
};

export default SearchSong;
