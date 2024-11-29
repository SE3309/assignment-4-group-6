import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../img/back.png";
import UserHeader from "./UserHeader";

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
      overflow: "hidden", // Prevent scrolling
    },
    header: {
      width: "100%",
      backgroundColor: "black",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
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
    navLink: {
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
      padding: "20px",
    },
    welcomeTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    brandName: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    brandHighlight: {
      backgroundColor: "#a5ff00",
      color: "black",
      padding: "5px 10px",
    },
    buttonContainer: {
      marginTop: "20px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
    },
    button: {
      backgroundColor: "#a5ff00",
      color: "black",
      border: "none",
      padding: "10px 15px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      borderRadius: "5px",
      textDecoration: "none",
      display: "inline-block",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoHighlight}>BRAT</span>music
        </div>
        <UserHeader />
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <div style={styles.brandName}>
          <span style={styles.brandHighlight}>BRAT</span>music
        </div>
        <div style={styles.welcomeTitle}>WELCOME TO YOUR USER PAGE!</div>

        {/* Button Section */}
        <div style={styles.buttonContainer}>
          <Link to="/SearchArtist" style={styles.button}>
            Go to Artists
          </Link>
          <Link to="/songs" style={styles.button}>
            View Songs
          </Link>
          <Link to="/playlists" style={styles.button}>
            View Playlists
          </Link>
          <Link to="/events" style={styles.button}>
            View Event Calendar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserWelcomePage;
