import React from "react";

const UserHeader = () => {
  const styles = {
    header: {
      width: "100%",
      backgroundColor: "black",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 40px",
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
      gap: "20px",
    },
    navLink: {
      fontSize: "1rem",
      textTransform: "capitalize",
      color: "white",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.header}>
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
        <span>👤</span> {/* User Icon */}
      </nav>
    </div>
  );
};

export default UserHeader;
