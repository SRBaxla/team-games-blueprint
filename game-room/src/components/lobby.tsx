// Lobby.jsx
import { useState } from 'react';
import { socket } from './socket';

export default function Lobby({ setView, setRoom, setName, setIsCreator }) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreate = () => {
    if (!playerName) return;
    socket.connect();
    socket.emit('create_room', playerName);
    setIsCreator(true);
  };

  const handleJoin = () => {
    if (!playerName || !roomCode) return;
    socket.connect();
    socket.emit('join_room', { name: playerName, room: roomCode });
    setIsCreator(false);
  };

  // Handle room creation and joining
  socket.on('room_created', ({ room, players }) => {
    setRoom(room);
    setName(playerName);
    setView('room');
  });

  socket.on('player_joined', ({ players }) => {
    setView('room');
  });

  socket.on('error', ({ message }) => {
    alert(`Error: ${message}`);
  });

  return (
    <div className="lobby">
      <input placeholder="Name" onChange={e => setPlayerName(e.target.value)} />
      <input placeholder="Room Code" onChange={e => setRoomCode(e.target.value.toUpperCase())} />
      <button onClick={handleCreate}>Create Room</button>
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
}
