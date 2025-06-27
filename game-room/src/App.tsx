import { useState } from 'react';
import Lobby from './components/lobby';
import Room from './pages/Room';
import Game from './pages/Game';

function App() {
  const [view, setView] = useState<'lobby' | 'room' | 'game'>('lobby');
  const [room, setRoom] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isCreator, setIsCreator] = useState<boolean>(false);

  switch (view) {
    case 'lobby':
      return (
        <Lobby
          setView={setView}
          setRoom={setRoom}
          setName={setName}
          setIsCreator={setIsCreator}
        />
      );
    case 'room':
      return (
        <Room
          room={room}
          name={name}
          setView={setView}
          isCreator={isCreator}
        />
      );
    case 'game':
      return <Game />;
    default:
      return null;
  }
}

export default App;
