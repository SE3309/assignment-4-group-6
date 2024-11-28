import React, { useState, useEffect } from 'react';
import UserHeader from './UserHeader';
import backgroundImage from "../img/back.png";


const DisplayEvent = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filterEvents = () => {
    const filtered = events.filter(event =>
      event.artistName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterEvents();
  };

  const styles = {
    page: {
        minHeight: "100vh", // Ensure the background covers at least the viewport height
        height: "auto", // Allow the content height to grow
        width: "100vw",
        background: `
          linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)),
          url(${backgroundImage})
        `,
        backgroundSize: "cover", // Make sure the background image scales properly
        backgroundPosition: "center", // Center the image
        backgroundAttachment: "fixed", // Fix the background in place
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        padding: "20px",
    },
    searchContainer: {
      marginTop: "20px",
      width: "80%",
      maxWidth: "600px",
      margin: "0 auto",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      border: "none",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    eventsList: {
      width: "80%",
      maxWidth: "600px",
      margin: "20px auto",
    },
    eventItem: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: "1.2rem",
      marginBottom: "10px",
    },
    eventDetail: {
      color: "#A1A1AA",
      marginBottom: "5px",
    },
  };

  return (
    <div style={styles.page}>
      <UserHeader />
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Artist Name"
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div style={styles.eventsList}>
        {filteredEvents.map((event, index) => (
          <div key={event.eventID || index} style={styles.eventItem}>
            <div style={styles.eventInfo}>
              <h3 style={styles.eventTitle}>Event {index + 1}</h3>
              <p style={styles.eventDetail}>By: {event.artistName}</p>
              <p style={styles.eventDetail}>Date: {event.eventDate}</p>
              <p style={styles.eventDetail}>Time: {event.eventTime}</p>
              <p style={styles.eventDetail}>Location: {event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayEvent;