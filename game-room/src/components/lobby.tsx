// src/components/Lobby.tsx
"use client";

import { useState } from "react";
import { socket } from "@/lib/socket"; // adjust path if needed

interface LobbyProps {
  setView: (view: string) => void;
  setRoom: (room: string) => void;
  setName: (name: string) => void;
  setIsCreator: (creator: boolean) => void;
}

export default function Lobby({ setView, setRoom, setName, setIsCreator }: LobbyProps) {
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleCreate = () => {
    if (!playerName) return;
    socket.connect();
    socket.emit("create_room", playerName);
    setIsCreator(true);
  };

  const handleJoin = () => {
    if (!playerName || !roomCode) return;
    socket.connect();
    socket.emit("join_room", { name: playerName, room: roomCode });
    setIsCreator(false);
  };

  socket.on("room_created", ({ room }) => {
    setRoom(room);
    setName(playerName);
    setView("room");
  });

  socket.on("player_joined", () => {
    setView("room");
  });

  socket.on("error", ({ message }) => {
    alert(`Error: ${message}`);
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <input
        placeholder="Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        className="border rounded p-2"
      />
      <div className="flex gap-2">
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Room
        </button>
        <button onClick={handleJoin} className="bg-green-600 text-white px-4 py-2 rounded">
          Join Room
        </button>
      </div>
    </div>
  );
}
