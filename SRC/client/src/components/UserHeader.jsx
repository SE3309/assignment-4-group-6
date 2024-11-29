import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import profileLogo from "../assets/greenProfileLogo.png"; // Adjust the path based on the file structure

const UserHeader = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const styles = {
    header: {
      position: "fixed", // Keeps the header at the top
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "black",
      display: "flex",
      justifyContent: "space-between", // Space between logo and nav
      alignItems: "center",
      padding: "15px 30px",
      zIndex: 1000, // Ensures the header stays above other content
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "white",
    },
    logoHighlight: {
      backgroundColor: "#a5ff00",
      color: "black",
      padding: "5px",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    navLink: (isHovered) => ({
      fontSize: "1rem",
      textTransform: "capitalize",
      color: isHovered ? "#9FFF00" : "white", // Green on hover, white otherwise
      textDecoration: "none",
      transition: "color 0.3s ease", // Smooth hover effect
    }),
    userIcon: {
      width: "35px",
      height: "35px",
      borderRadius: "50%", // Makes the image circular
      cursor: "pointer", // Indicates it's clickable
    },
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoHighlight}>BRAT</span>music
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        <Link
          to="/SearchArtist"
          style={styles.navLink(hoveredLink === "artists")}
          onMouseEnter={() => setHoveredLink("artists")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          artists
        </Link>
        <Link
          to="/SearchSong"
          style={styles.navLink(hoveredLink === "songs")}
          onMouseEnter={() => setHoveredLink("songs")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          songs
        </Link>
        <Link
          to="/playlists"
          style={styles.navLink(hoveredLink === "playlists")}
          onMouseEnter={() => setHoveredLink("playlists")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          playlists
        </Link>
        <Link
          to="/logout"
          style={styles.navLink(hoveredLink === "signout")}
          onMouseEnter={() => setHoveredLink("signout")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          sign out
        </Link>

        {/* User Profile Image */}
        <img
          src={profileLogo}
          alt="User Profile"
          style={styles.userIcon}
        />
      </nav>
    </header>
  );
};

export default UserHeader;
