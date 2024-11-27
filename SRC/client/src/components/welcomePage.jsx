import React from "react";


const WelcomePage = () => {
    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logo}>
                    <span style={styles.logoBRAT}>BRAT</span>
                    <span style={styles.logoMusic}>music</span>
                </div>
                <div style={styles.authButtons}>
                    <button style={styles.authButton}>log in</button>
                    <button style={styles.authButton}>sign up</button>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                <h1 style={styles.welcomeText}>WELCOME TO</h1>
                <h1 style={styles.bratMusic}>BRAT <span style={styles.logoMusic}>music</span></h1>
                <div style={styles.buttons}>
                    <button style={styles.userTypeButton}>ARTIST</button>
                    <button style={styles.userTypeButton}>USER</button>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#1E1E1E", // Dark background
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%", // Full width of the viewport
    },
    header: {
        width: "100%",
        maxWidth: "1200px", // Center content for laptop screens
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
    },
    logo: {
        fontSize: "2rem", // Increased size for laptop screens
        fontWeight: "bold",
    },
    logoBRAT: {
        color: "#82E85F", // Green color
    },
    logoMusic: {
        color: "white",
    },
    authButtons: {
        display: "flex",
        gap: "20px",
    },
    authButton: {
        backgroundColor: "transparent",
        color: "white",
        border: "none",
        fontSize: "1.2rem",
        cursor: "pointer",
        fontWeight: "bold",
    },
    main: {
        textAlign: "center",
        marginTop: "50px",
    },
    welcomeText: {
        fontSize: "3rem",
        fontWeight: "bold",
        margin: "0",
    },
    bratMusic: {
        fontSize: "4rem", // Increased size for laptop screens
        fontWeight: "bold",
        margin: "10px 0",
    },
    buttons: {
        display: "flex",
        flexDirection: "row", // Align buttons horizontally
        gap: "20px",
        marginTop: "30px",
        justifyContent: "center",
    },
    userTypeButton: {
        backgroundColor: "#EAEAEA",
        color: "#1E1E1E",
        border: "none",
        borderRadius: "5px",
        padding: "15px 30px",
        fontSize: "1.5rem", // Increased button size
        cursor: "pointer",
        fontWeight: "bold",
        minWidth: "200px", // Ensures buttons are wide enough
    },
};

export default WelcomePage;
