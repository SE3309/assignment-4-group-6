import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import backgroundImage from "../img/back.png";

const SearchArtist = () => {
  const [query, setQuery] = useState(""); // State for search query
  const [artists, setArtists] = useState([]); // State for artist results
  const [error, setError] = useState(""); // State for error messages

  // Fetch all artists on component mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("/api/artist");
        console.log(response.data); // Debug API response
        setArtists(response.data); // Update results with API response
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
      setArtists(response.data); // Update results with search results
      setError("");
    } catch (err) {
      console.error(err);
      setError("No artists found.");
      setArtists([]); // Clear results on error
    }
  };

  const styles = {
    page: {
      height: "100vh",
      width: "100vw",
      background: `
        linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
        url(${backgroundImage})
      `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      padding: "20px",
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
    results: {
      marginTop: "20px",
      textAlign: "center",
    },
    resultItem: {
      margin: "10px 0",
      fontSize: "1.2rem",
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
            <div key={index} style={styles.resultItem}>
              {artist.artistName}
            </div>
          ))
        ) : (
          <p>No artists found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchArtist;
