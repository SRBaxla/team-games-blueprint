import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';

interface RoomProps {
  room: string;
  name: string;
  setView: (view: 'lobby' | 'room' | 'game') => void;
  isCreator: boolean;
}

export default function Room({ room, name, setView, isCreator }: RoomProps) {
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const handlePlayerJoined = ({ players }: { players: string[] }) => {
      setPlayers(players);
    };

    const handlePlayerLeft = ({ remaining }: { remaining: string[] }) => {
      setPlayers(remaining);
    };

    const handleGameStart = () => {
      setView('game');
    };

    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_left', handlePlayerLeft);
    socket.on('game_start', handleGameStart);

    return () => {
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_left', handlePlayerLeft);
      socket.off('game_start', handleGameStart);
    };
  }, [setView]);

  const handleStart = () => {
    if (isCreator) {
      socket.emit('start_game', room);
    }
  };

  return (
    <div>
      <h2>Room: {room}</h2>
      <ul>
        {players.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {isCreator && <button onClick={handleStart}>Start Game</button>}
    </div>
  );
}
