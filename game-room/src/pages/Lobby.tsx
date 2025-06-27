"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Player = { name: string };
type GameMode = "1v1" | "team" | "tournament";

export default function Lobby() {
  const navigate = useNavigate();
  const socket = getSocket();

  const [roomCode, setRoomCode] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("1v1");
  const [isHost, setIsHost] = useState<boolean>(false);

  useEffect(() => {
    socket.on("room_created", ({ room, players }) => {
      setRoomCode(room);
      setPlayers(players.map((name) => ({ name })));
      setIsHost(true);
    });

    socket.on("player_joined", ({ player, players }) => {
      setPlayers(players.map((name) => ({ name })));
    });

    socket.on("game_start", ({ room }) => {
      toast.success("Game starting!");
      navigate(`/game/${room}`);
    });

    return () => {
      socket.off("room_created");
      
      socket.off("player_joined");
      socket.off("game_start");
    };
  }, []);

  const handleStartGame = () => {
    if (players.length < 2) {
      toast.error("At least 2 players required.");
      return;
    }
    socket.emit("start_game", roomCode);
  };

  return (
    <div className="min-h-screen bg-[#122118] text-white p-6">
      <h1 className="text-3xl font-bold mb-2 text-center">🧩 Game Lobby</h1>
      <p className="text-center text-sm text-gray-400 mb-4">
        Room Code: <span className="font-mono text-green-400">{roomCode}</span>
      </p>

      <div className="flex flex-col items-center gap-2 mb-6">
        <label className="font-semibold">Choose Game Mode:</label>
        <select
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value as GameMode)}
          className="bg-[#264532] p-2 rounded text-white"
        >
          <option value="1v1">1v1</option>
          <option value="team">Team Battle</option>
          <option value="tournament">Tournament</option>
        </select>
      </div>

      <div className="bg-white/10 p-4 rounded-xl shadow w-full max-w-md mx-auto mb-6">
        <h2 className="font-semibold mb-2">👥 Players</h2>
        <ul className="space-y-1">
          {players.map((p, i) => (
            <li key={i} className="text-sm">
              {p.name}
            </li>
          ))}
        </ul>
      </div>

      {isHost && (
        <div className="flex justify-center">
          <Button onClick={handleStartGame}>Start Game</Button>
        </div>
      )}
    </div>
  );
}
