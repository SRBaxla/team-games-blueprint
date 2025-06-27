import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  createRoom,
  joinRoom,
} from "@/lib/socket";
import { RoomCodeModal } from "./RoomCodeModal";

export default function GameWindow() {
  const [name, setName] = useState("");
  const [connected, setConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState<string>("");

  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("room_created", ({ room }) => {
      toast.success(`Room created: ${room}`);
      setRoomCode(room);
      navigate("/lobby");
    });

    socket.on("player_joined", ({ player, players }) => {
      toast(`${player} joined!`);
    });

    socket.on("error", ({ message }) => {
      toast.error(message);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleCreateRoom = () => {
    if (!name.trim()) {
      toast.error("Please enter your name before creating a room.");
      return;
    }

    createRoom(name);
  };

  const handleJoinRoom = () => {
    if (!name.trim()) {
      toast.error("Please enter your name before joining a room.");
      return;
    }

    setModalOpen(true);
  };

  const handleJoin = (roomCode: string) => {
    if (!roomCode.trim()) {
      toast.error("Room code is required.");
      return;
    }

    joinRoom(name, roomCode.trim().toUpperCase());
  };

  return (
    <div
      className="min-h-screen bg-[#122118] text-white"
      style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#264532] px-10 py-4">
          <div className="flex items-center gap-4">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
              />
            </svg>
            <h1 className="text-lg font-bold tracking-tight">
              Rock Paper Scissors
            </h1>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#264532] text-sm font-bold">
            {connected ? "Connected" : "Offline"}
          </button>
        </header>

        {/* Room Code Modal */}
        <RoomCodeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onJoin={handleJoin}
        />

        {/* Main */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-md bg-white/10 text-white rounded-2xl p-6 backdrop-blur-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
              🎮 Join the Game
            </h2>

            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-4">
              <Button onClick={handleCreateRoom} className="w-1/2">
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={handleJoinRoom}
                className="w-1/2"
              >
                Join
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
