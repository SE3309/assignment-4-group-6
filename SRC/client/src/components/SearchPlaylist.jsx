import React, { useState, useEffect } from "react";
import backgroundImage from "../img/back.png";
import UserHeader from './UserHeader';

const SearchPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [songsByPlaylist, setSongsByPlaylist] = useState({}); // Added state to store songs for each playlist
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedPlaylistID, setSelectedPlaylistID] = useState(null);


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
      const storedUser = localStorage.getItem("user");

      if (!token) {
        throw new Error("No authentication token found");
      }
      if (!storedUser) {
        throw new Error("No user information found in localStorage.");
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.UserID;

      console.log("Fetching playlists for user:", userId);

      const response = await fetch(`/api/user-playlists?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched playlists:", data);

      setPlaylists(data.playlists || []);
      setFilteredPlaylists(data.playlists || []);
      
      // Fetch songs for each playlist after fetching playlists
      fetchSongsForPlaylists(data.playlists || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  // Fetch songs for each playlist
  const fetchSongsForPlaylists = async (playlists) => {
    const token = localStorage.getItem("token");
    const songsData = {};

    await Promise.all(
      playlists.map(async (playlist) => {
        try {
          const response = await fetch(`/api/playlist-songs?playlistId=${playlist.PlaylistID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            songsData[playlist.PlaylistID] = data.songs || [];
          } else {
            console.error(`Failed to fetch songs for playlist ${playlist.PlaylistID}`);
          }
        } catch (error) {
          console.error(`Error fetching songs for playlist ${playlist.PlaylistID}:`, error);
        }
      })
    );

    setSongsByPlaylist(songsData); // Store the fetched songs data in state
  };

  // Create a new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name || !newPlaylist.description) {
      alert("Please provide both a name and description for the playlist.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Example: Fetch userId from local storage or a global state
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
          description: newPlaylist.description,
          mediaId: newPlaylist.mediaId || null, // Optional
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Catch invalid JSON
        throw new Error(errorData.error || "Failed to create playlist");
      }
  
      const data = await response.json(); // Parse JSON response
      setSuccessMessage(data.message);
      fetchPlaylists(); // Refresh playlists after creation
      setNewPlaylist({ name: "", description: "", mediaId: "" }); // Clear inputs
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error creating playlist:", error.message);
      alert(error.message); // Show error message to the user
    } finally {
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

  const handlePlaylistClick = (playlistID) => {
    // Toggle the selected playlist
    setSelectedPlaylistID((prevID) => (prevID === playlistID ? null : playlistID));
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
      cursor: "pointer",
    },
    noPlaylists: {
      textAlign: "center",
      color: "#A1A1AA",
      marginTop: "20px",
    },
    songItem: {
      marginLeft: "20px",
      fontSize: "1rem",
    },
  };
  
  return (
    <div style={styles.page}>
      <UserHeader />
      <h1 style={styles.title}>My Playlists</h1>

      {/* Success Message */}
      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

      {/* Create New Playlist */}
      <div style={styles.newPlaylistContainer}>
        <h2>Create New Playlist</h2>
        <input
          type="text"
          placeholder="Playlist Name"
          style={styles.newPlaylistInput}
          value={newPlaylist.name}
          onChange={(e) =>
            setNewPlaylist({ ...newPlaylist, name: e.target.value })
          }
        />
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
          <div
            key={playlist.PlaylistID}
            style={styles.playlistItem}
            onClick={() => handlePlaylistClick(playlist.PlaylistID)}
          >
            <h3>{playlist.Description || "Untitled Playlist"}</h3>
            <p>Created: {new Date(playlist.DateAdded).toLocaleDateString()}</p>
            {/* Toggle display of songs */}
            {selectedPlaylistID === playlist.PlaylistID && (
              <div>
                <h4>Songs:</h4>
                {songsByPlaylist[playlist.PlaylistID] &&
                songsByPlaylist[playlist.PlaylistID].length > 0 ? (
                  songsByPlaylist[playlist.PlaylistID].map((song) => (
                    <p key={song.MediaID} style={styles.songItem}>
                      {song.mediaName} by {song.artistName}
                    </p>
                  ))
                ) : (
                  <p>No songs in this playlist.</p>
                )}
              </div>
            )}
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