// lib/socket.ts
import { io, Socket } from "socket.io-client";

// Types for incoming/outgoing events
type ServerToClientEvents = {
  room_created: (payload: { room: string; players: string[] }) => void;
  player_joined: (payload: { player: string; players: string[] }) => void;
  game_start: (payload: { room: string }) => void;
  game_update: (state: { players: string[]; scores: Record<string, number> }) => void;
  player_left: (payload: { player: string; remaining: string[] }) => void;
  error: (payload: { message: string }) => void;
};

type ClientToServerEvents = {
  create_room: (name: string) => void;
  join_room: (data: { name: string; room: string }) => void;
  start_game: (room: string) => void;
  player_action: (data: any) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const createRoom = (name: string) => {
  const s = connectSocket();
  s.emit("create_room", name);
};

export const joinRoom = (name: string, room: string) => {
  const s = connectSocket();
  s.emit("join_room", { name, room });
};

export const startGame = (room: string) => {
  getSocket().emit("start_game", room);
};

export const sendAction = (data: any) => {
  getSocket().emit("player_action", data);
};
