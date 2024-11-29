import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from '../assets/BMLogo.png';
import profileLogo from "../assets/greenProfileLogo.png"; // Adjust the path based on the file structure

import React, { useState } from "react";
import { Link } from "react-router-dom";
import profileLogo from "../img/profileLogo.png"; // Replace with the actual path to your profile image
import Logo from "../img/logo.png"; // Replace with the actual path to your logo

const UserHeader = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const styles = {
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "black",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      zIndex: 1000,
      boxSizing: "border-box",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      marginRight: "auto",
    },
    logo: {
      height: "50px",
      width: "auto",
    },
    logoText: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "white",
      marginLeft: "10px",
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
      color: isHovered ? "#9FFF00" : "white",
      textDecoration: "none",
      transition: "color 0.3s ease",
    }),
    profileIcon: {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      cursor: "pointer",
    },
  };

  return (
    <header style={styles.header}>
      {/* Logo Section */}
      <div style={styles.logoContainer}>
        <img src={Logo} alt="BRAT music logo" style={styles.logo} />
        <div style={styles.logoText}>
          <span style={styles.logoHighlight}>BRAT</span>music
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        <Link to="/SearchAlbum" style={linkStyle}>Album</Link>

        <Link
          to="/SearchArtist"
          style={styles.navLink(hoveredLink === "artists")}
          onMouseEnter={() => setHoveredLink("artists")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Artists
        </Link>
        <Link
          to="/SearchSong"
          style={styles.navLink(hoveredLink === "songs")}
          onMouseEnter={() => setHoveredLink("songs")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Songs
        </Link>
        <Link
          to="/SearchPlaylist"
          style={styles.navLink(hoveredLink === "playlists")}
          onMouseEnter={() => setHoveredLink("playlists")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Playlists
        </Link>
        <Link
          to="/DisplayEvent"
          style={styles.navLink(hoveredLink === "event")}
          onMouseEnter={() => setHoveredLink("event")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Events
        </Link>
        <Link
          to="/"
          style={styles.navLink(hoveredLink === "logout")}
          onMouseEnter={() => setHoveredLink("logout")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Log Out
        </Link>

        {/* Profile Icon */}
        <Link to="/ProfileSettings">
          <img
            src={profileLogo}
            alt="User Profile"
            style={styles.profileIcon}
          />
        </Link>
      </nav>
    </header>
  );
};

export default UserHeader;

