import { useState } from 'react'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import WelcomePage from './components/welcomePage'
import ArtistWelcomePage from './components/ArtistWelcomePage'
import SearchArtist from './components/SearchArtist'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/Artist" element={<ArtistWelcomePage />} />
        <Route path="/SearchArtist" element={<SearchArtist />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
