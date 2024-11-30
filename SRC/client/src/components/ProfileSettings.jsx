import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader"; // Adjust path as needed
import backgroundImage from "../img/back.png"; // Corrected import path

const ProfileSettings = () => {
  const [userData, setUserData] = useState(null); // To store user data
  const [isEditing, setIsEditing] = useState(false); // For the edit modal state
  const [newDisplayName, setNewDisplayName] = useState(""); // For editing display name
  const [userID, setUserID] = useState(null);
  let [cleanUserID, setCleanedUserID] = useState(null); // State to hold parsed UserID
  let [subscriptionType, setSubscriptionType] = useState("");


  //const UserID = localStorage.getItem("user.email");
  // Replace this with the dynamic email of the logged-in user

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserInfo = async () => {
        const storedUserID = localStorage.getItem("UserID");
        if (storedUserID) {
            // Remove any quotes around the UserID (if present) before parsing
            cleanUserID = storedUserID.replace(/^"|"$/g, '');
            setCleanedUserID(cleanUserID);  // Set parsed UserID to state
            console.log(cleanUserID); // Your UserID

        } else {
          console.log("UserID not found in localStorage.");
        }    
        

        try {
          const response = await fetch(`/api/userInfo/${cleanUserID}`);
          if (!response.ok) {
            const errorDetails = await response.json();
            console.error("API Error:", errorDetails);
            throw new Error(`Error: ${errorDetails.message || "Unknown error"}`);
          }
          const data = await response.json();
          if (data.user) {
            setUserData(data.user);
            setNewDisplayName(data.user.DisplayName);
            setSubscriptionType(data.user.SubscriptionType);
          } else {
            throw new Error("User not found");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          alert(`Error loading user information: ${error.message}`);
        }
      };
      

    fetchUserInfo();
  }, [cleanUserID]);

  const saveChanges = () => {
    // Logic for saving changes (API call to update user info)
    console.log("Saving new display name:", newDisplayName);

    // Update the state locally after saving
    setUserData((prevData) => ({
      ...prevData,
      DisplayName: newDisplayName,
    }));

    setIsEditing(false); // Close the edit modal
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw",
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
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
      width: "100%",
      flexWrap: "wrap",
    },
    section: {
      flex: "1",
      maxWidth: "400px",
      padding: "20px",
      backgroundColor: "rgba(43, 43, 43, 0.8)",
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
      color: "#ccc",
      marginBottom: "5px",
      display: "block",
    },
    fieldValue: {
      color: "#1ed760",
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
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      width: "300px",
      textAlign: "center",
    },
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <UserHeader />
      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>profile settings</h2>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>display name</label>
            <span style={styles.fieldValue}>{userData.DisplayName}</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>email</label>
            <span style={styles.fieldValue}>{cleanUserID}</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>password</label>
            <span style={styles.fieldValue}>********</span>
          </div>
          <button style={styles.editButton} onClick={() => setIsEditing(true)}>
            EDIT
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>subscription settings</h2>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>your plan</label>
            <span style={styles.fieldValue}>{subscriptionType}</span>
          </div>
          <button style={styles.editButton}>upgrade</button>
        </div>
      </div>

      {isEditing && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Edit Profile Settings</h3>
            <label htmlFor="displayName">Display Name:</label>
            <input
              type="text"
              id="displayName"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              style={{ width: "100%", margin: "10px 0", padding: "5px" }}
            />
            <button style={styles.editButton} onClick={saveChanges}>
              Save
            </button>
            <button
              style={{
                ...styles.editButton,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
