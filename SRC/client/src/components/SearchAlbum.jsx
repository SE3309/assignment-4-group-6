import React, { useState, useEffect } from 'react';
import UserHeader from './UserHeader';
import backgroundImage from "../img/back.png";
const SearchAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [mediaDetails, setMediaDetails] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  useEffect(() => {
    fetchAlbums();
  }, []);
  useEffect(() => {
    filterAlbums();
  }, [searchTerm, albums]);
  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/albums/details');
      const data = await response.json();
      if (data.albums) {
        setAlbums(data.albums);
        setFilteredAlbums(data.albums);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };
  const fetchMediaDetails = async (albumId) => {
    try {
      const response = await fetch(`/api/media/details/${albumId}`);
      const data = await response.json();
      if (data.media) {
        setMediaDetails(data.media);
      }
    } catch (error) {
      console.error('Error fetching media details:', error);
    }
  };
  const filterAlbums = () => {
    if (searchTerm === '') {
      setFilteredAlbums(albums);
    } else {
      const filtered = albums.filter(album =>
        album.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlbums(filtered);
    }
  };
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
      width: "90%",
      maxWidth: "1200px",
      gap: "20px",
      marginTop: "20px",
    },
    albumsSection: {
      flex: "1",
      maxWidth: "500px",
    },
    mediaSection: {
      flex: "1",
      maxWidth: "500px",
    },
    searchInput: {
      width: "80%",
      maxWidth: "500px",
      padding: "10px",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      marginBottom: "20px",
    },
    albumCard: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    selectedAlbum: {
      backgroundColor: "rgba(159, 255, 0, 0.2)",
      transform: "scale(1.02)",
    },
    mediaCard: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
    },
    title: {
      fontSize: "1.4rem",
      color: "#9FFF00",
      marginBottom: "10px",
    },
    detail: {
      color: "#A1A1AA",
      marginBottom: "5px",
    },
    noMedia: {
      textAlign: "center",
      color: "#A1A1AA",
      marginTop: "20px",
    }
  };
  return (
    <div style={styles.page}>
      <UserHeader />
      <input
        type="text"
        placeholder="Search by album name..."
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div style={styles.contentContainer}>
        <div style={styles.albumsSection}>
          <h2 style={styles.title}>Albums</h2>
          {filteredAlbums.map((album) => (
            <div
              key={album.albumID}
              style={{
                ...styles.albumCard,
                ...(selectedAlbum?.albumID === album.albumID ? styles.selectedAlbum : {}),
              }}
              onClick={() => handleAlbumClick(album)}
            >
              <h3 style={styles.title}>{album.artistName}</h3>
              <p style={styles.detail}>Album ID: {album.albumID}</p>
              <p style={styles.detail}>
                Created: {new Date(album.dateCreated).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        {selectedAlbum && (
          <div style={styles.mediaSection}>
            <h2 style={styles.title}>Songs in {selectedAlbum.artistName}'s Album</h2>
            {mediaDetails.length > 0 ? (
              mediaDetails.map((media) => (
                <div key={media.mediaID} style={styles.mediaCard}>
                  <h3 style={styles.title}>{media.mediaName}</h3>
                  <p style={styles.detail}>Length: {media.lengthOfMedia} seconds</p>
                  <p style={styles.detail}>Ranking: {media.mediaRanking}</p>
                  <p style={styles.detail}>
                    Times Played: {media.totalDurationListenedTo} seconds
                  </p>
                </div>
              ))
            ) : (
              <div style={styles.noMedia}>No songs found in this album</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchAlbum;