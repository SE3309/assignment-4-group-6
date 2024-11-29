import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import UserWelcomePage from "./components/UserWelcomePage";
import UserHeader from "./components/UserHeader";
import ArtistWelcomePage from './components/ArtistWelcomePage';
import SearchArtist from './components/SearchArtist';
import SearchSong from "./components/SearchSong";
import DisplayEvent from "./components/DisplayEvent";
import CreateEvent from "./components/CreateEvent";
import NewWelcomePage from "./components/NewWelcomePage";
import Login from "./components/Login";

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewWelcomePage />} />
        <Route path="/user-welcome" element={<UserWelcomePage />} />
        <Route path="/user-header" element={<UserHeader />} />
        <Route path="/artist" element={<ArtistWelcomePage />} />
        <Route path="/search-artist" element={<SearchArtist />} />
        <Route path="/search-song" element={<SearchSong />} />
        <Route path="/display-event" element={<DisplayEvent />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/UserWelcomePage" element={<UserWelcomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;