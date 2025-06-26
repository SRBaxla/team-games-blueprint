import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function GameWindow() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [connected, setConnected] = useState(false);
  type CreateRoomResponse = { error?: string; roomCode?: string };
  type JoinRoomResponse = { error?: string; success?: boolean };

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    const socket = socketRef.current;

    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected");
    });

    socket.on("room-created", ({ roomId }) => {
      toast.success(`Room created: ${roomId}`);
    });

    socket.on("room-joined", ({ roomId }) => {
      toast.success(`Joined room: ${roomId}`);
    });

    socket.on("userJoined", ({ name }) => {
      toast(`${name} joined the room!`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleCreateRoom = () => {
    if (!name.trim()) {
      toast.error("Enter a name to create a room.");
      return;
    }

    socketRef.current?.emit("createRoom", name, (response: CreateRoomResponse) => {
      if (response?.error) {
        toast.error(response.error);
      } else {
        const { roomCode } = response;
        console.log("Room created:", roomCode);
      }
    });
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomCode.trim()) {
      toast.error("Enter name and room code to join.");
      return;
    }

    socketRef.current?.emit(
      "joinRoom",
      {
        name,
        roomCode: roomCode.trim().toUpperCase(),
      },
      (response: JoinRoomResponse) => {
        if (response?.error) {
          toast.error(response.error);
        } else {
          console.log("Joined room successfully");
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-md shadow-lg text-white w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🎮 Join the Game</h2>

      <Input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-3"
      />

      <Button onClick={handleCreateRoom} className="w-full mb-4">
        Create Room
      </Button>

      <Input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="mb-3"
      />

      <Button variant="secondary" onClick={handleJoinRoom} className="w-full">
        Join Room
      </Button>
    </div>
  );
}
