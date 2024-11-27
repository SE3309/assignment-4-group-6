import { useState } from 'react'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import WelcomePage from './components/welcomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
