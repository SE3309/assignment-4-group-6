import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader";
import backgroundImage from "../img/back.png";

const SearchPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch playlists on component mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Filter playlists when search term or playlists change
  useEffect(() => {
    filterPlaylists();
  }, [searchTerm, playlists]);

  // Fetch the user's playlists
  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = "ellaharding"; // Replace with the actual user ID
  
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`/api/user-playlists?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      setPlaylists(data.playlists || []);
      setFilteredPlaylists(data.playlists || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };
  
  
  

  // Create a new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylist.description) {
      alert("Please provide a description for the playlist.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/createPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: "ellaharding", // Replace with actual logged-in user ID
          description: newPlaylist.description,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        fetchPlaylists(); // Refresh the playlists after creation
        setNewPlaylist({ description: "" }); // Clear the input
        setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
      } else {
        alert(data.error || "Failed to create playlist.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setIsLoading(false);
    }
  };

  // Filter playlists based on search term
  const filterPlaylists = () => {
    if (searchTerm === "") {
      setFilteredPlaylists(playlists); // Show all playlists when search is empty
    } else {
      const filtered = playlists.filter((playlist) =>
        playlist.PlaylistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlaylists(filtered);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
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
      marginTop: "65px",
    },
    title: {
      fontSize: "2rem",
      marginBottom: "20px",
      textAlign: "center",
    },
    searchContainer: {
      width: "80%",
      maxWidth: "600px",
      margin: "0 auto 20px",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "none",
    },
    newPlaylistContainer: {
      width: "80%",
      maxWidth: "600px",
      marginBottom: "30px",
    },
    newPlaylistInput: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "none",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#9FFF00",
      color: "#000",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "10px",
    },
    successMessage: {
      textAlign: "center",
      color: "#9FFF00",
      marginBottom: "20px",
    },
    playlistItem: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "5px",
      flexDirection: "column",
      color: "white",
    },
    noPlaylists: {
      textAlign: "center",
      color: "#A1A1AA",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.page}>
      <UserHeader />
      <h1 style={styles.title}>My Playlists</h1>

      {/* Success Message */}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      {/* Search Playlists */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search your playlists..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Create New Playlist */}
      <div style={styles.newPlaylistContainer}>
        <h2>Create New Playlist</h2>
        <input
          type="text"
          placeholder="Playlist Description"
          style={styles.newPlaylistInput}
          value={newPlaylist.description}
          onChange={(e) =>
            setNewPlaylist({ ...newPlaylist, description: e.target.value })
          }
        />
        <button style={styles.button} onClick={handleCreatePlaylist}>
          Create Playlist
        </button>
      </div>

      {/* Display Playlists */}
      {isLoading ? (
        <p>Loading...</p>
      ) : filteredPlaylists.length > 0 ? (
        filteredPlaylists.map((playlist) => (
          <div key={playlist.PlaylistID} style={styles.playlistItem}>
            <h3>{playlist.PlaylistName || "Untitled Playlist"}</h3>
            <p>Created: {new Date(playlist.CreationDate).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p style={styles.noPlaylists}>
          {searchTerm
            ? "No playlists match your search."
            : "You haven't created any playlists yet."}
        </p>
      )}
    </div>
  );
};

export default SearchPlaylists;
