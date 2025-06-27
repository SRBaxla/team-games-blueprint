// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
// import GamePage from "./pages/GamePage"; // optional

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
      {/* <Route path="/game/:roomId" element={<GamePage />} /> */}
    </Routes>
  );
}
