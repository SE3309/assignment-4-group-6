import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserWelcomePage from "./components/UserWelcomePage";
import UserHeader from "./components/UserHeader";
import ArtistWelcomePage from './components/ArtistWelcomePage';
import SearchArtist from './components/SearchArtist';
import SearchSong from "./components/SearchSong";
import DisplayEvent from "./components/DisplayEvent";
import CreateEvent from "./components/CreateEvent";
import NewWelcomePage from "./components/NewWelcomePage";
import Login from "./components/Login";
import SearchPlaylist from "./components/SearchPlaylist";
import ProfileSettings from "./components/ProfileSettings";
import SearchAlbum from "./components/SearchAlbum";
import ArtistRevenue from "./components/ArtistRevenue";
import CreateAlbum from "./components/CreateAlbumMain";
import Register from "./components/Register";


function App()
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewWelcomePage />} />
        <Route path="/UserWelcomePage" element={<UserWelcomePage />} />
        <Route path="/UserHeader" element={<UserHeader />} />
        <Route path="/ArtistWelcomePage" element={<ArtistWelcomePage />} />
        <Route path="/SearchArtist" element={<SearchArtist />} />
        <Route path="/SearchSong" element={<SearchSong />} />
        <Route path="/DisplayEvent" element={<DisplayEvent />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/UserWelcomePage" element={<UserWelcomePage />} />
        <Route path="/SearchPlaylist" element={<SearchPlaylist />} />
        <Route path="/SearchAlbum" element={<SearchAlbum />} />
        <Route path="/ProfileSettings" element={<ProfileSettings />} />
        <Route path="/Revenue" element={<ArtistRevenue />} />
        <Route path="/CreateAlbum" element={<CreateAlbum />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;