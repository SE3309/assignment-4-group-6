import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import backgroundImage from "../img/back.png";

const SearchArtist = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [mediaDetails, setMediaDetails] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);

  // Fetch artists when the component mounts
  useEffect(() => {
    fetchArtists();
  }, []);

  // Filter artists when search term changes
  useEffect(() => {
    filterArtists();
  }, [searchTerm, artists]);

  // Fetch all artists
  const fetchArtists = async () => {
    try {
      const response = await axios.get("/api/artist");
      if (response.data) {
        setArtists(response.data);
        setFilteredArtists(response.data);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  // Fetch albums for a selected artist
  const fetchAlbums = async (artistName) => {
    try {
      const response = await axios.get(`/api/albums/${artistName}`);
      console.log("Fetched albums:", response.data.albums); // Check if albumName is present
      setAlbums(response.data.albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      setAlbums([]);
    }
  };
  


  // Fetch media details for a selected album
  const fetchMediaDetails = async (albumId) => {
    try {
      const response = await axios.get(`/api/media/details/${albumId}`);
      if (response.data.media) {
        setMediaDetails(response.data.media);
      }
    } catch (error) {
      console.error("Error fetching media details:", error);
      setMediaDetails([]);
    }
  };

  // Filter artists based on the search term
  const filterArtists = () => {
    if (searchTerm === "") {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter((artist) =>
        artist.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  };

  // Handle selecting an artist
  const handleArtistClick = async (artist) => {
    if (selectedArtist?.artistName === artist.artistName) {
      setSelectedArtist(null);
      setAlbums([]);
      setMediaDetails([]);
    } else {
      setSelectedArtist(artist);
      await fetchAlbums(artist.artistName);
    }
  };

  // Handle selecting an album
  const handleAlbumClick = async (album) => {
    if (selectedAlbum?.albumID === album.albumID) {
      setSelectedAlbum(null);
      setMediaDetails([]);
    } else {
      setSelectedAlbum(album);
      await fetchMediaDetails(album.albumID);
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
    contentContainer: {
      display: "flex",
      flexDirection: "row",
      width: "90%",
      maxWidth: "1200px",
      gap: "30px",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    section: {
      flex: "1",
      maxWidth: "500px",
      marginBottom: "30px",
    },
    searchInput: {
      width: "80%",
      maxWidth: "500px",
      padding: "12px",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      marginBottom: "20px",
      backgroundColor: "#222",
      color: "white",
      outline: "none",
    },
    card: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      color: "#CCC",
    },
    selectedCard: {
      backgroundColor: "rgba(50, 205, 50, 0.3)", // Subtle green background for selection
      transform: "scale(1.02)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.5)",
    },
    songCard: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      color: "#DDD",
    },
    title: {
      fontSize: "1.5rem",
      color: "#9FFF00",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    artistDetail: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#EEE",
    },
    albumTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#9FFF00",
      marginBottom: "10px",
    },
    albumDetail: {
      fontSize: "1rem",
      color: "#CCC",
    },
    songTitle: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "#9FFF00",
      marginBottom: "10px",
    },
    songDetail: {
      fontSize: "1rem",
      color: "#BBB",
      marginBottom: "5px",
    },
    noData: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#AAA",
      marginTop: "20px",
    },
  };
  
  

  return (
    <div style={styles.page}>
  <UserHeader />
  <input
    type="text"
    placeholder="Search for an artist..."
    style={styles.searchInput}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <div style={styles.contentContainer}>
    <div style={styles.section}>
      <h2 style={styles.title}>Artists</h2>
      {filteredArtists.map((artist) => (
        <div
          key={artist.artistName}
          style={{
            ...styles.card,
            ...(selectedArtist?.artistName === artist.artistName
              ? styles.selectedCard
              : {}),
          }}
          onClick={() => handleArtistClick(artist)}
        >
          <p style={styles.artistDetail}>{artist.artistName}</p>
        </div>
      ))}
    </div>

    <div style={styles.section}>
      <h2 style={styles.title}>Albums</h2>
      {albums.length > 0 ? (
        albums.map((album) => (
          <div
            key={album.albumID}
            style={{
              ...styles.card,
              ...(selectedAlbum?.albumID === album.albumID
                ? styles.selectedCard
                : {}),
            }}
            onClick={() => handleAlbumClick(album)}
          >
            <p style={styles.albumTitle}>{album.albumName}</p>
            <p style={styles.albumDetail}>
              Created: {new Date(album.dateCreated).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <div style={styles.noData}>No artist selected</div>
      )}
    </div>

    {selectedAlbum && (
      <div style={styles.section}>
        <h2 style={styles.title}>Songs</h2>
        {mediaDetails.length > 0 ? (
          mediaDetails.map((media) => (
            <div key={media.mediaID} style={styles.songCard}>
              <h3 style={styles.songTitle}>{media.mediaName}</h3>
              <p style={styles.songDetail}>Length: {media.lengthOfMedia} seconds</p>
              <p style={styles.songDetail}>Ranking: {media.mediaRanking}</p>
              <p style={styles.songDetail}>
                Times Played: {media.totalDurationListenedTo} seconds
              </p>
            </div>
          ))
        ) : (
          <div style={styles.noData}>No songs found in this album</div>
        )}
      </div>
    )}
  </div>
</div>

  );
  
  
};

export default SearchArtist;

