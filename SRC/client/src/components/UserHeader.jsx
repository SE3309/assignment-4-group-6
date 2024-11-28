import React, { useState } from "react";
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
      transform: "translateX(-50px)", // Move navigation further left
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
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.logoHighlight}>BRAT</span>music
      </div>
      <nav style={styles.nav}>
        <a
          href="#artists"
          style={styles.navLink(hoveredLink === "artists")}
          onMouseEnter={() => setHoveredLink("artists")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          artists
        </a>
        <a
          href="#songs"
          style={styles.navLink(hoveredLink === "songs")}
          onMouseEnter={() => setHoveredLink("songs")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          songs
        </a>
        <a
          href="#playlists"
          style={styles.navLink(hoveredLink === "playlists")}
          onMouseEnter={() => setHoveredLink("playlists")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          playlists
        </a>
        <a
          href="/logout"
          style={styles.navLink(hoveredLink === "signout")}
          onMouseEnter={() => setHoveredLink("signout")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          sign out
        </a>
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


