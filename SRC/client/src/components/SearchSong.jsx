import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import backgroundImage from "../img/back.png";

const SearchSong = () => {
  const [mediaName, setMediaName] = useState("");
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  // Fetch all songs and user's playlists on component mount
  useEffect(() => {
    fetchAllSongs();
    fetchPlaylists();
  }, []);

  const fetchAllSongs = async () => {
    try {
      const response = await axios.get("/api/search-song");
      setAllSongs(response.data.songs || []);
    } catch (err) {
      console.error("Error fetching all songs:", err);
      setError("Unable to fetch all songs at the moment.");
    }
  };

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        throw new Error("Missing authentication data");
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.UserID;

      const response = await axios.get(`/api/user-playlists?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaylists(response.data.playlists || []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
      setError("Unable to fetch playlists at the moment.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/search-song", {
        params: { mediaName },
      });
      setSongs(response.data.songs || []);
      setError("");
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError(err.response?.data?.message || "An error occurred while searching for songs.");
      setSongs([]);
    }
  };

  const handleAddToPlaylist = async (songId, playlistId) => {
    try {
      const response = await axios.post("/api/add-song-to-playlist", {
        songId,
        playlistId,
      });
  
      alert(response.data.message); // Show success message
    } catch (err) {
      console.error("Error adding song to playlist:", err);
      alert(err.response?.data?.error || "Failed to add song to playlist.");
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
    dropdown: {
      margin: "10px 0",
    },
    addButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "5px 10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
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
                  <strong>Length:</strong> {song.lengthOfMedia}
                </p>
                <select
                  style={styles.dropdown}
                  value={selectedPlaylist}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                >
                  <option value="">Select a playlist</option>
                  {playlists.map((playlist) => (
                    <option key={playlist.PlaylistID} value={playlist.PlaylistID}>
                      {playlist.Description}
                    </option>
                  ))}
                </select>
                <button
                  style={styles.addButton}
                  onClick={() => handleAddToPlaylist(song.mediaID, selectedPlaylist)}
                  disabled={!selectedPlaylist}
                >
                  Add to Playlist
                </button>
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
                <strong>Length:</strong> {song.lengthOfMedia}
              </p>
              <select
                style={styles.dropdown}
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
              >
                <option value="">Select a playlist</option>
                {playlists.map((playlist) => (
                  <option key={playlist.PlaylistID} value={playlist.PlaylistID}>
                    {playlist.Description}
                  </option>
                ))}
              </select>
              <button
                style={styles.addButton}
                onClick={() => handleAddToPlaylist(song.mediaID, selectedPlaylist)}
                disabled={!selectedPlaylist}
              >
                Add to Playlist
              </button>
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
