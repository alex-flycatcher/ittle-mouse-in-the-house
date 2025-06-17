import { useState } from 'react';
import { MemoryRouter  as Router, Routes, Route, Link } from 'react-router-dom';
import MouseGame from './MouseGame';
import EmojiWheel from './EmojiWheel';
import AnimalsGame from './AnimalsGame';
import AnimalsBox from './AnimalsBox';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="game-nav">
          <Link to="/">Mouse Game</Link>
          <Link to="/animal-game">Animal Game</Link>
          {/* <Link to="/animal-box">Animal Box</Link> */}
          <Link to="/emoji-wheel">Emoji Wheel</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<MouseGame />} />
          <Route path="/animal-game" element={<AnimalsGame />} />
          <Route path="/animal-box" element={<AnimalsBox />} />
          <Route path="/emoji-wheel" element={<EmojiWheel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;