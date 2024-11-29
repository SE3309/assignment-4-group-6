import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import UserWelcomePage from "./components/UserWelcomePage"; // Adjust path as needed
import UserHeader from "./components/UserHeader"; // Adjust path as needed
import ArtistWelcomePage from './components/ArtistWelcomePage'
import SearchArtist from './components/SearchArtist'
import SearchSong from "./components/SearchSong";
import DisplayEvent from "./components/DisplayEvent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/UserWelcomePage" element={<UserWelcomePage />} /> {/* Add this line */}
        <Route path="/UserHeader" element={<UserHeader />} /> {/* Add this line */}
        <Route path="/Artist" element={<ArtistWelcomePage />} />
        <Route path="/SearchArtist" element={<SearchArtist />} />
        <Route path="/SearchSong" element={<SearchSong />} />
        <Route path="/DisplayEvent" element={<DisplayEvent />} />        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
