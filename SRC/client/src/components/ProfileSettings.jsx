import React from "react";
import UserHeader from "./UserHeader"; // Adjust path as needed
import backgroundImage from "../img/back.png"; // Corrected import path

const ProfileSettings = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column", // Stack the header and content vertically
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh", // Full viewport height
      width: "100vw", // Full viewport width
      background: `
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
          url(${backgroundImage})
        `,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "20px",
    },
    content: {
      display: "flex",
      justifyContent: "center", // Center the content horizontally
      alignItems: "center", // Center the content vertically
      gap: "20px", // Space between profile and subscription settings
      width: "100%", // Ensure content spans full width
      flexWrap: "wrap", // Ensure responsiveness on smaller screens
    },
    section: {
      flex: "1",
      maxWidth: "400px", // Prevent sections from being too wide
      padding: "20px",
      backgroundColor: "rgba(43, 43, 43, 0.8)", // Semi-transparent background
      borderRadius: "8px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "white",
    },
    field: {
      marginBottom: "10px",
      fontSize: "14px",
    },
    fieldLabel: {
      color: "#ccc", // Muted gray
      marginBottom: "5px",
      display: "block",
    },
    fieldValue: {
      color: "#1ed760", // Spotify-like green
      fontWeight: "bold",
    },
    editButton: {
      marginTop: "10px",
      padding: "10px 20px",
      backgroundColor: "#1ed760",
      color: "#000",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <UserHeader /> {/* Header remains at the top */}
      <div style={styles.content}>
        {/* Profile Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>profile settings</h2>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>display name</label>
            <span style={styles.fieldValue}>sarah</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>email</label>
            <span style={styles.fieldValue}>sarah@gmail.com</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>password</label>
            <span style={styles.fieldValue}>********</span>
          </div>
          <button style={styles.editButton}>EDIT</button>
        </div>

        {/* Subscription Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>subscription settings</h2>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>your plan</label>
            <span style={styles.fieldValue}>free tier</span>
          </div>
          <button style={styles.editButton}>upgrade</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

