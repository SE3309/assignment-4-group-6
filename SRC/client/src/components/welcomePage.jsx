import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../img/back.png";


const WelcomePage = () => {
  return (
    <div style={styles.landingPage}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoHighlight}>BRAT</span>music
        </div>
        <div style={styles.authLinks}>
          <Link to="/login" style={styles.authLink}>
            log in
          </Link>
          <Link to="/register" style={styles.authLink}>
            sign up
          </Link>
        </div>
      </div>
      <div style={styles.content}>
        <h1 style={styles.welcomeTitle}>WELCOME TO</h1>
        <div style={styles.brandName}>
          <span style={styles.brandHighlight}>BRAT</span>music
        </div>
      </div>
    </div>
  );
};

const styles = {
  landingPage: {
    position: "relative",
    height: "100vh",
    width: "100vw", // Use 100vw to ensure it spans the full viewport width
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    zIndex: 1,
    background: `
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), 
      url(${backgroundImage})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden", // Prevent any potential overflow causing white space
  },
  
  
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  authLinks: {
    display: "flex",
    gap: "20px",
  },
  authLink: {
    fontSize: "1rem",
    textTransform: "uppercase",
    cursor: "pointer",
    color: "white",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  authLinkHover: {
    color: "#a5ff00",
  },
  content: {
    textAlign: "center",
  },
  welcomeTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    margin: 0,
    marginBottom: "10px",
  },
  brandName: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  brandHighlight: {
    backgroundColor: "#a5ff00",
    color: "black",
    padding: "5px 10px",
  },
};

export default WelcomePage;
