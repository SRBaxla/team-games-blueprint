"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSocket, emitStartGame, emitChangeMode } from "@/lib/socket";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLobby } from "@/context/LobbyContext";

const VALID_GAME_MODES = ["1v1", "team", "tournament"] as const;
type GameMode = (typeof VALID_GAME_MODES)[number];
type Player = { name: string };

export default function Lobby() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const { setRoomCode, setIsHost, isHost, name } = useLobby();

  const socket = getSocket(); // Use getSocket instead of connectSocket
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("1v1");
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Prevent duplicate fetches
  const listenersSet = useRef(false); // Track if listeners are set
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Initial room setup
  useEffect(() => {
    if (!roomCode) {
      navigate("/");
      return;
    }

    console.log("[DEBUG] Initializing lobby for room:", roomCode);
    setRoomCode(roomCode);
    
    // Setup socket listeners only once
    if (!listenersSet.current) {
      setupSocketListeners();
      listenersSet.current = true;
    }

    const fetchRoomState = () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      console.log("[DEBUG] Emitting get_room_state for", roomCode);
      socket.emit("get_room_state", roomCode);
    };

    // Handle connection state
    if (socket.connected) {
      console.log("[DEBUG] Socket already connected");
      fetchRoomState();
    } else {
      console.log("[DEBUG] Socket not connected, waiting for connection");
      socket.once("connect", () => {
        console.log("[DEBUG] Socket connected in Lobby");
        fetchRoomState();
      });
      
      // Manually connect if not connected
      if (!socket.connected) {
        console.log("[DEBUG] Manually connecting socket");
        socket.connect();
      }
    }

    return () => {
      socket.off("connect", fetchRoomState);
    };
  }, [roomCode]);

  useEffect(() => {
  socket.on("connect", () => setConnectionStatus("connected"));
  socket.on("disconnect", () => setConnectionStatus("disconnected"));
}, []);
  // Set up socket listeners
  const setupSocketListeners = () => {
    console.log("Setting up socket listeners");
    
    socket.on("room_state", (data: any) => {
      console.log("room_state received:", data);
      setPlayers(data.players.map((name: string) => ({ name })));
      
      if (VALID_GAME_MODES.includes(data.mode as GameMode)) {
        setGameMode(data.mode as GameMode);
      }
      
      setIsHost(data.players[0] === name);
      setLoading(false);
    });

    socket.on("player_joined", (data: any) => {
      setPlayers(data.players.map((name: string) => ({ name })));
      toast(`${data.player} joined the room.`);
    });

    socket.on("player_left", (data: any) => {
      setPlayers(data.remaining.map((name: string) => ({ name })));
      toast(`${data.player} left the room.`);
    });

    socket.on("host_changed", (data: any) => {
      if (socket.id === data.new_host) {
        setIsHost(true);
        toast("You are now the host.");
      }
    });

    socket.on("game_start", (data: any) => {
      toast.success("Game starting...");
      navigate(`/game/${data.room}`);
    });

    socket.on("kicked", () => {
      toast.error("You were kicked from the room.");
      navigate("/");
    });

    socket.on("mode_updated", (data: any) => {
      if (VALID_GAME_MODES.includes(data.mode as GameMode)) {
        setGameMode(data.mode as GameMode);
        toast(`Game mode changed to ${data.mode}`);
      }
    });

    socket.on("error", (data: any) => {
      toast.error(data.message);
    });
  };

  const handleStartGame = () => {
    if (!roomCode) {
      toast.error("Room code is missing.");
      return;
    }

    if (players.length < 2) {
      toast.error("At least 2 players required to start.");
      return;
    }

    socket.emit("start_game", roomCode);
  };

  const handleModeChange = (newMode: GameMode) => {
    if (!isHost) return;
    setGameMode(newMode);
    if (roomCode) socket.emit("change_mode", { room: roomCode, mode: newMode });
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success("Room code copied to clipboard!");
    }
  };

  const handleLeaveRoom = () => {
    socket.disconnect();
    setRoomCode("");
    setIsHost(false);
    toast("You left the room.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#122118] text-white flex items-center justify-center">
        <p>Loading lobby...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#122118] text-white p-6">
      <h1 className="text-3xl font-bold mb-2 text-center">🧩 Game Lobby</h1>

      <p className="text-center text-sm text-gray-400 mb-4">
        Room Code: <span className="font-mono text-green-400">{roomCode}</span>
        {isHost && <span className="ml-2 text-yellow-400">(Host)</span>}
      </p>

      <div className="flex justify-center gap-4 mb-6">
        <Button variant="secondary" onClick={handleCopyCode}>
          Copy Room Code
        </Button>
        <Button variant="destructive" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 mb-6">
        <label className="font-semibold">Choose Game Mode:</label>
        <select
          value={gameMode}
          onChange={(e) => handleModeChange(e.target.value as GameMode)}
          className="bg-[#264532] p-2 rounded text-white"
          disabled={!isHost}
        >
          {VALID_GAME_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode === "1v1"
                ? "1v1"
                : mode === "team"
                ? "Team Battle"
                : "Tournament"}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white/10 p-4 rounded-xl shadow w-full max-w-md mx-auto mb-6">
        <h2 className="font-semibold mb-2">👥 Players ({players.length})</h2>
        <ul className="space-y-2">
          {players.map((p, i) => (
            <li
              key={i}
              className="flex items-center text-sm p-2 bg-white/5 rounded"
            >
              <span>{p.name}</span>
              {i === 0 && (
                <span className="ml-2 text-xs bg-yellow-700 px-2 py-1 rounded">
                  Host
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isHost && (
        <div className="flex justify-center">
          <Button onClick={handleStartGame} disabled={players.length < 2}>
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}
