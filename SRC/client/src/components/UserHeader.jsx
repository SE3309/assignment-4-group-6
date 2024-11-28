import React from "react";

const UserHeader = () => {
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
    navLink: {
      fontSize: "1rem",
      textTransform: "capitalize",
      color: "white",
      textDecoration: "none",
    },
    userIcon: {
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      border: "2px solid #a5ff00",
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.logoHighlight}>BRAT</span>music
      </div>
      <nav style={styles.nav}>
        <a href="#artists" style={styles.navLink}>
          artists
        </a>
        <a href="#songs" style={styles.navLink}>
          songs
        </a>
        <a href="#playlists" style={styles.navLink}>
          playlists
        </a>
        <a href="/logout" style={styles.navLink}>
          sign out
        </a>
        {/* User Profile Image */}
        <img
          src="https://via.placeholder.com/30"
          alt="User Profile"
          style={styles.userIcon}
        />
      </nav>
    </header>
  );
};

export default UserHeader;
