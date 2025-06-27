import { useEffect, useState } from 'react';
import { socket } from '../components/socket';

interface GameState {
  players: string[];
  scores: Record<string, number>;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const handleGameUpdate = (state: GameState) => {
      setGameState(state);
    };

    socket.on('game_update', handleGameUpdate);
    return () => {
      socket.off('game_update', handleGameUpdate);
    };
  }, []);

  const handleAction = () => {
    socket.emit('player_action', { action: 'example_move' });
  };

  return (
    <div>
      <h2>Game In Progress</h2>
      {gameState && (
        <pre>{JSON.stringify(gameState, null, 2)}</pre>
      )}
      <button onClick={handleAction}>Send Action</button>
    </div>
  );
}
