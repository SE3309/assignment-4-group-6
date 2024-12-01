import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader"; // Adjust path as needed
import backgroundImage from "../img/back.png"; // Corrected import path

const ProfileSettings = () => {
  const [userData, setUserData] = useState(null); // To store user data
  const [isEditing, setIsEditing] = useState(false); // For the edit modal state
  const [newDisplayName, setNewDisplayName] = useState(""); // For editing display name
  const [newPassword, setNewPassword] = useState(""); // For editing password
  const [userID, setUserID] = useState(null);
  let [cleanUserID, setCleanedUserID] = useState(null); // State to hold parsed UserID
  let [subscriptionType, setSubscriptionType] = useState("");
  let [startDate, setStartDate] = useState(""); // Start date of subscription
  let [userPlaylistID, setUserPlaylistID] = useState(""); // User Playlist ID
  let [newSubscriptionType, setNewSubscriptionType] = useState(""); // For editing subscription type
  const [isEditingSubscription, setIsEditingSubscription] = useState(false); // For the subscription edit modal state



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
            setNewPassword(data.user.Password);
            setNewSubscriptionType(data.user.SubscriptionType);
            setStartDate(data.user.StartDateOfSubscription);
            setUserPlaylistID(data.user.PlaylistLibraryID);
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

 // Utility function to update a user field
 const saveChanges = async (field) => {
    let updatedData = {};
    let apiUrl = '';
    let bodyData = {};

    switch (field) {
      case "DisplayName":
        updatedData.DisplayName = newDisplayName || userData.DisplayName;
        apiUrl = `/api/userInfo/displayName/${userData.UserID}`;
        bodyData = { DisplayName: updatedData.DisplayName };
        break;
      case "Password":
        updatedData.Password = newPassword || userData.Password;
        apiUrl = `/api/userInfo/password/${userData.UserID}`;
        bodyData = { Password: updatedData.Password };
        break;
      case "SubscriptionType":
        updatedData.SubscriptionType = newSubscriptionType || userData.SubscriptionType;
        apiUrl = `/api/userInfo/subscriptionType/${userData.UserID}`;
        bodyData = { SubscriptionType: updatedData.SubscriptionType };
        break;
      default:
        alert("Invalid field");
        return;
    }

    try {
      // Sending PUT request to update user info in the database for the specific field
      const response = await fetch(apiUrl, {
        method: 'PUT', // HTTP method for update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),  // Dynamically set the field to be updated
      });

      // If the response is not okay, throw an error
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error:", errorDetails);
        throw new Error(`Error: ${errorDetails.message || "Unknown error"}`);
      } else {
        const updatedUser = await response.json();
        console.log("User info updated:", updatedUser);
        alert("User info updated successfully!");
      }

      // Reset editing states for all fields after saving
      setIsEditing(false);
      setIsEditingSubscription(false);
    } catch (error) {
      console.error("Error saving user info:", error);
      alert(`Error saving user information: ${error.message}`);
    }
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
      maxWidth: "500px",
      padding: "20px",
      backgroundColor: "rgba(43, 43, 43, 0.8)",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    sectionTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "white",
    },
    field: {
      marginBottom: "15px",
      fontSize: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fieldLabel: {
      color: "#ccc",
      fontWeight: "bold",
      marginRight: "10px",
    },
    fieldValue: {
      color: "#1ed760",
      fontWeight: "bold",
    },
    inputField: {
      width: "92%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#1ed760",
      color: "#000",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      width: "100%",
    },
    buttonCancel: {
      backgroundColor: "red",
      color: "white",
      marginTop: "10px",
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
    label: {
        color: "black",
        width: "96.5%",

    },
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <UserHeader />
      <div style={styles.content}>
        {/* Display Name Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Profile Settings</h2>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Display Name:</label>
            <span style={styles.fieldValue}>{userData.DisplayName}</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Email:</label>
            <span style={styles.fieldValue}>{cleanUserID}</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Password:</label>
            <span style={styles.fieldValue}>********</span>
          </div>
          <button style={styles.button} onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>

        {/* Subscription Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Subscription Settings</h2>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Plan:</label>
            <span style={styles.fieldValue}>{userData.SubscriptionType}</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Start Date:</label>
            <span style={styles.fieldValue}>{startDate}</span>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Playlist ID:</label>
            <span style={styles.fieldValue}>{userPlaylistID}</span>
          </div>
          <button style={styles.button} onClick={() => setIsEditingSubscription(true)}>Edit</button>
        </div>
      </div>

      {isEditing && (
  <div style={styles.modal}>
    <div style={styles.modalContent}>
      <h3 style={styles.label}>Edit Profile</h3>
      <label style={styles.label} htmlFor="displayName">Display Name:</label>
      <input
        type="text"
        id="displayName"
        value={newDisplayName}
        onChange={(e) => setNewDisplayName(e.target.value)}
        style={styles.inputField}
      />
      <button style={styles.button} onClick={() => saveChanges('DisplayName')}>Save Display Name</button><br></br>
      <br></br><label style={styles.label} htmlFor="password">New Password:</label>
      <input
        type="password"
        id="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={styles.inputField}
      />
      <button style={styles.button} onClick={() => saveChanges('Password')}>Save Password</button>
      <button
        style={{ ...styles.button, ...styles.buttonCancel }}
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
{/* Subscription Edit Modal */}
    {isEditingSubscription && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.label}>Edit Subscription Type</h3>
            <label style={styles.label} htmlFor="subscriptionType">Subscription Type:</label>
            <select
              id="subscriptionType"
              value={newSubscriptionType}
              onChange={(e) => setNewSubscriptionType(e.target.value)}
              style={styles.selectField}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            <button style={styles.button} onClick={() => saveChanges('SubscriptionType')}>Save Subscription Type</button>
            <button
              style={{ ...styles.button, ...styles.buttonCancel }}
              onClick={() => setIsEditingSubscription(false)}
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
