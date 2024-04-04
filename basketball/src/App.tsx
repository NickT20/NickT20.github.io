import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamePlayer from './pages/GamePlayer';
import CharacterCreator from './pages/CharacterCreator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePlayer />} />
        <Route path="character" element={<CharacterCreator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
