import React, { useState, useEffect } from 'react';
import UserHeader from './UserHeader';
import backgroundImage from "../img/back.png";

const SearchPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    filterPlaylists();
  }, [searchTerm, playlists]);

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/user-playlists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPlaylists(data);
      setFilteredPlaylists(data); // Initialize filtered playlists with all playlists
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const filterPlaylists = () => {
    if (searchTerm === '') {
      setFilteredPlaylists(playlists); // Show all playlists when search is empty
    } else {
      const filtered = playlists.filter(playlist =>
        playlist.PlaylistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlaylists(filtered);
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
    title: {
      fontSize: "2rem",
      marginBottom: "20px",
      textAlign: "center",
    },
    searchContainer: {
      marginTop: "20px",
      width: "80%",
      maxWidth: "600px",
      margin: "0 auto",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      marginBottom: "20px",
    },
    existingPlaylists: {
      width: "80%",
      maxWidth: "600px",
      marginTop: "30px",
    },
    playlistsList: {
      width: "100%",
    },
    playlistItem: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      transition: "transform 0.2s ease",
      cursor: "pointer",
    },
    playlistInfo: {
      flex: 1,
    },
    playlistTitle: {
      fontSize: "1.2rem",
      marginBottom: "10px",
      color: "#9FFF00", // Green color to match your theme
    },
    playlistDetail: {
      color: "#A1A1AA",
      marginBottom: "5px",
    },
    noPlaylists: {
      textAlign: "center",
      color: "#A1A1AA",
      marginTop: "20px",
    }
  };

  return (
    <div style={styles.page}>
      <UserHeader />
      <h1 style={styles.title}>My Playlists</h1>
      
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search your playlists..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.existingPlaylists}>
        {filteredPlaylists.length > 0 ? (
          <div style={styles.playlistsList}>
            {filteredPlaylists.map((playlist, index) => (
              <div 
                key={playlist.PlaylistID || index} 
                style={{
                  ...styles.playlistItem,
                  ':hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <div style={styles.playlistInfo}>
                  <h3 style={styles.playlistTitle}>{playlist.PlaylistName}</h3>
                  <p style={styles.playlistDetail}>
                    Created: {new Date(playlist.CreationDate).toLocaleDateString()}
                  </p>
                  <p style={styles.playlistDetail}>
                    Songs: {playlist.SongCount || 0}
                  </p>
                  <p style={styles.playlistDetail}>
                    Duration: {playlist.TotalDuration || '0:00'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noPlaylists}>
            {searchTerm ? "No playlists match your search" : "You haven't created any playlists yet"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPlaylists;