import React, { useState, useEffect } from 'react';
import ArtistNavBAr from './ArtistNavBar';
import backgroundImage from "../img/back.png";

const CreateEvent = () => {
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    eventID: '',
    eventDate: '',
    eventTime: '',
    location: '',
  });
  const [loggedInArtist, setLoggedInArtist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch logged-in artist and token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const artist = JSON.parse(localStorage.getItem('artist'));
      setLoggedInArtist(artist);
    }
  }, []);

  // Fetch events when logged-in artist is available
  useEffect(() => {
    if (loggedInArtist) {
      fetchEvents();
    }
  }, [loggedInArtist]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.events) {
        // Filter events for logged-in artist
        const artistEvents = data.events.filter(
          (event) => event.artistName === loggedInArtist.artistName
        );
        setEvents(artistEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = {
      ...eventForm,
      artistName: loggedInArtist.artistName,
    };

    try {
      const response = await fetch('/api/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEvents();
        setEventForm({
          eventID: '',
          eventDate: '',
          eventTime: '',
          location: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create event.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('artist');
    window.location.href = '/login'; // Redirect to login page
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100vw",
      background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      padding: "20px",
    },
    container: {
      marginTop: "80px",
      width: "80%",
      maxWidth: "600px",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "none",
    },
    button: {
      backgroundColor: "#a5ff00",
      color: "black",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      border: "none",
    },
    eventsList: {
      marginTop: "20px",
      width: "100%",
    },
    eventItem: {
      padding: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      marginBottom: "10px",
      borderRadius: "5px",
      color: "white",
    },
    error: {
      color: "red",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.page}>
      <ArtistNavBAr />
      <div style={styles.container}>
        <h2>Create Event</h2>
        {loggedInArtist && <p>Welcome, {loggedInArtist.artistName}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="eventID"
            value={eventForm.eventID}
            onChange={handleInputChange}
            placeholder="Event Name"
          />
          <input
            style={styles.input}
            type="date"
            name="eventDate"
            value={eventForm.eventDate}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="time"
            name="eventTime"
            value={eventForm.eventTime}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text"
            name="location"
            value={eventForm.location}
            onChange={handleInputChange}
            placeholder="Location"
          />
          <button type="submit" style={styles.button}>
            Create Event
          </button>
        </form>
        {loading && <p>Loading events...</p>}
        <div style={styles.eventsList}>
          {events.map((event) => (
            <div key={event.eventID} style={styles.eventItem}>
              <h4>{event.eventID}</h4>
              <p>{event.eventDate} @ {event.eventTime}</p>
              <p>Location: {event.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
