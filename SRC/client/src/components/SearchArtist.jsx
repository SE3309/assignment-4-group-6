import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import backgroundImage from "../img/back.png";
import defaultArtistImage from "../img/artistImg.png"; // Import your artist placeholder image

const SearchArtist = () => {
  const [query, setQuery] = useState(""); // State for search query
  const [artists, setArtists] = useState([]); // State for artist results
  const [error, setError] = useState(""); // State for error messages
  const [selectedArtist, setSelectedArtist] = useState(null); // State for selected artist
  const [artistDetails, setArtistDetails] = useState(null); // State for artist details (albums, playlists, songs)

  // Fetch all artists on component mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("/api/artist");
        setArtists(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching artists.");
      }
    };

    fetchArtists();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("/api/artist", {
        params: { artistName: query },
      });
      setArtists(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No artists found.");
      setArtists([]);
    }
  };

  const handleArtistClick = async (artist) => {
    setSelectedArtist(artist);
    try {
      const response = await axios.get(`/api/artist-details/${artist.artistName}`); // Replace with your API endpoint
      setArtistDetails(response.data);
    } catch (err) {
      console.error(err);
      setArtistDetails(null);
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
    contentContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      maxWidth: "1200px",
    },
    artistList: {
      width: "50%", // Keep the artist list fixed at half-width
      padding: "20px",
    },
    searchContainer: {
      marginBottom: "20px",
      width: "100%",
    },
    searchInput: {
      width: "100%",
      padding: "12px",
      fontSize: "1.1rem",
      border: "none",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    searchButton: {
      backgroundColor: "#a5ff00",
      color: "black",
      fontSize: "1rem",
      fontWeight: "bold",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    results: {
      textAlign: "center",
    },
    resultItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
      margin: "20px 0",
      fontSize: "1.5rem",
      gap: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    artistImage: {
      width: "100px",
      height: "100px",
      borderRadius: "15px",
      objectFit: "cover",
      backgroundColor: "#ccc",
    },
    detailsPanel: {
      width: "50%",
      padding: "20px",
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      color: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      overflowY: "auto",
    },
    errorMessage: {
      color: "red",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.page}>
      <UserHeader />
      <div style={styles.contentContainer}>
        <div style={styles.artistList}>
          <div style={styles.searchContainer}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for an artist..."
                style={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" style={styles.searchButton}>
                Search
              </button>
            </form>
          </div>
          <div style={styles.results}>
            {error && <p style={styles.errorMessage}>{error}</p>}
            {Array.isArray(artists) && artists.length > 0 ? (
              artists.map((artist, index) => (
                <div
                  key={index}
                  style={styles.resultItem}
                  onClick={() => handleArtistClick(artist)}
                >
                  <img
                    src={defaultArtistImage}
                    alt={`${artist.artistName} Thumbnail`}
                    style={styles.artistImage}
                  />
                  <span>{artist.artistName}</span>
                </div>
              ))
            ) : (
              <p>No artists found.</p>
            )}
          </div>
        </div>
        <div style={styles.detailsPanel}>
          {selectedArtist ? (
            <>
              <h2>{selectedArtist.artistName}</h2>
              <div>
                <h3>Albums</h3>
                <ul>
                  {artistDetails?.albums?.map((album, index) => (
                    <li key={index}>{album.name}</li>
                  )) || <p>No albums available.</p>}
                </ul>
              </div>
              <div>
                <h3>Playlists</h3>
                <ul>
                  {artistDetails?.playlists?.map((playlist, index) => (
                    <li key={index}>{playlist.name}</li>
                  )) || <p>No playlists available.</p>}
                </ul>
              </div>
              <div>
                <h3>Songs</h3>
                <ul>
                  {artistDetails?.songs?.map((song, index) => (
                    <li key={index}>{song.name}</li>
                  )) || <p>No songs available.</p>}
                </ul>
              </div>
            </>
          ) : (
            <p>Select an artist to display their details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchArtist;

