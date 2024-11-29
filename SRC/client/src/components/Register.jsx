import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../img/back.png";


function Register() {
   const [role, setRole] = useState("user");
   const [username, setUsername] = useState("");
   const [displayName, setDisplayName] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const navigate = useNavigate();


   const handleRegister = async (e) => {
       e.preventDefault();
       setError("");
  
       try {
           if (role === "user") {
               const requestBody = {
                   UserID: username,
                   DisplayName: displayName,
                   Password: password
               };
              
               console.log('Sending registration request:', requestBody);
              
               const response = await fetch('http://localhost:3000/register', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(requestBody),
               });
          
               const data = await response.json();
               console.log('Registration response:', data);
          
               if (response.ok) {
                   navigate('/login');
               } else {
                   setError(data.message || 'Registration failed');
               }
           } else if (role === "artist") {
               // Artist Registration (keep this part as is)
               const response = await fetch('http://localhost:3000/api/register-artist', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                       artistName: username,
                       email: displayName,
                       password: password
                   }),
               });
  
               const data = await response.json();
  
               if (response.ok) {
                   navigate('/login');
               } else {
                   setError(data.message || 'Registration failed');
               }
           }
       } catch (err) {
           setError('Connection error. Please try again.');
           console.error('Registration error:', err);
       }
   };


   return (
       <div style={styles.landingPage}>
           <div style={styles.header}>
               <div style={styles.logo}>
                   <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                       <span style={styles.logoHighlight}>BRAT</span>music
                   </Link>
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
               <div style={styles.loginBox}>
                   <h1 style={styles.loginTitle}>REGISTER</h1>
                   {error && <div style={styles.error}>{error}</div>}
                   <form onSubmit={handleRegister}>
                       <label style={styles.formLabel}>REGISTER AS</label>
                       <select
                           value={role}
                           onChange={(e) => setRole(e.target.value)}
                           style={styles.formInput}
                       >
                           <option value="user">User</option>
                           <option value="artist">Artist</option>
                       </select>


                       <label style={styles.formLabel}>
                           {role === "artist" ? "ARTIST NAME" : "USERNAME"}
                       </label>
                       <input
                           type="text"
                           placeholder={role === "artist" ? "Enter artist name" : "Enter username"}
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           style={styles.formInput}
                       />


                       <label style={styles.formLabel}>
                           {role === "artist" ? "EMAIL" : "DISPLAY NAME"}
                       </label>
                       <input
                           type={role === "artist" ? "email" : "text"}
                           placeholder={role === "artist" ? "Enter email" : "Enter display name"}
                           value={displayName}
                           onChange={(e) => setDisplayName(e.target.value)}
                           style={styles.formInput}
                       />


                       <label style={styles.formLabel}>PASSWORD</label>
                       <input
                           type="password"
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           style={styles.formInput}
                       />


                       <button type="submit" style={styles.loginButton}>
                           REGISTER
                       </button>
                   </form>
               </div>
           </div>
       </div>
   );
}


const styles = {
   error: {
       color: '#ff4444',
       textAlign: 'center',
       marginBottom: '15px',
       fontSize: '14px',
   },
   landingPage: {
       position: "relative",
       height: "100vh",
       width: "100vw",
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
       overflow: "hidden",
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
   content: {
       width: "100%",
       display: "flex",
       justifyContent: "center",
       alignItems: "center",
       padding: "20px",
   },
   loginBox: {
       backgroundColor: "rgba(0, 0, 0, 0.8)",
       padding: "40px",
       borderRadius: "10px",
       boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
       width: "90%",
       maxWidth: "400px",
   },
   loginTitle: {
       fontSize: "2rem",
       marginBottom: "20px",
       textAlign: "center",
       color: "white",
   },
   formLabel: {
       display: "block",
       fontSize: "14px",
       marginBottom: "10px",
       color: "white",
   },
   formInput: {
       width: "100%",
       padding: "10px",
       marginBottom: "20px",
       fontSize: "16px",
       border: "none",
       borderRadius: "5px",
       backgroundColor: "white",
   },
   loginButton: {
       width: "100%",
       padding: "10px",
       fontSize: "16px",
       border: "none",
       borderRadius: "5px",
       backgroundColor: "#a5ff00",
       color: "black",
       fontWeight: "bold",
       cursor: "pointer",
       transition: "background-color 0.3s",
   }
};


export default Register;
