import React from "react";
import backgroundImage from "../img/back.png";


const UserWelcomePage = () => {

  const styles = {
    page: {
      height: "100vh",
      width: "100vw",
      background: `
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), 
      url(${backgroundImage})
    `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
    },
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
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    welcomeTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    brandName: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: "10px 0",
    },
    brandHighlight: {
      backgroundColor: "#a5ff00",
      color: "black",
      padding: "5px 10px",
    },
  };

  return (
    <div style={styles.page}>
      {/* Header Section */}
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

      {/* Content Section */}
      <div style={styles.content}>
      <div style={styles.brandName}>
          <span style={styles.brandHighlight}>BRAT</span>music
        </div>
        <div style={styles.welcomeTitle}>WELCOME TO YOUR USER PAGE</div>
        
      </div>
    </div>
  );
};

export default UserWelcomePage;
