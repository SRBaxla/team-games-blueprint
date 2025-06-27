import { useState } from 'react';
import { socket } from './socket';

interface LobbyProps {
  setView: (view: 'lobby' | 'room' | 'game') => void;
  setRoom: (room: string) => void;
  setName: (name: string) => void;
  setIsCreator: (isCreator: boolean) => void;
}

export default function Lobby({ setView, setRoom, setName, setIsCreator }: LobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreate = () => {
    if (!playerName) return;
    socket.connect();
    socket.emit('create_room', playerName);
    setIsCreator(true);
    setName(playerName);
  };

  const handleJoin = () => {
    if (!playerName || !roomCode) return;
    socket.connect();
    socket.emit('join_room', { name: playerName, room: roomCode });
    setIsCreator(false);
    setName(playerName);
  };

  socket.on('room_created', ({ room, players }: { room: string; players: string[] }) => {
    setRoom(room);
    setView('room');
  });

  socket.on('player_joined', ({ players }: { players: string[] }) => {
    setView('room');
  });

  socket.on('error', ({ message }: { message: string }) => {
    alert(`Error: ${message}`);
  });

  return (
    <div>
      <input placeholder="Name" onChange={(e) => setPlayerName(e.target.value)} />
      <input placeholder="Room Code" onChange={(e) => setRoomCode(e.target.value.toUpperCase())} />
      <button onClick={handleCreate}>Create Room</button>
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}
