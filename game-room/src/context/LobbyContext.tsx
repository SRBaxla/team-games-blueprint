import { createContext, useContext, useState } from "react";

interface LobbyContextProps {
  name: string;
  setName: (n: string) => void;
  roomCode: string;
  setRoomCode: (r: string) => void;
  isHost: boolean;
  setIsHost: (h: boolean) => void;
}

const LobbyContext = createContext<LobbyContextProps | null>(null);

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isHost, setIsHost] = useState(false);

  return (
    <LobbyContext.Provider value={{ name, setName, roomCode, setRoomCode, isHost, setIsHost }}>
      {children}
    </LobbyContext.Provider>
  );
};

export const useLobby = () => {
  const ctx = useContext(LobbyContext);
  if (!ctx) throw new Error("useLobby must be used within LobbyProvider");
  return ctx;
};
