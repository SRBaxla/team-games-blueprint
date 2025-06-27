import { io, Socket } from "socket.io-client";

type ServerToClientEvents = {
  room_created: (payload: { room: string; players: string[] }) => void;
  player_joined: (payload: { player: string; players: string[] }) => void;
  player_left: (payload: { player: string; remaining: string[] }) => void;
  game_start: (payload: { room: string }) => void;
  mode_updated: (payload: { mode: string }) => void;
  room_state: (payload: { players: string[]; mode: string }) => void;
  host_changed: (payload: { new_host: string }) => void;
  kicked: () => void;
  error: (payload: { message: string }) => void;
};

type ClientToServerEvents = {
  create_room: (
    name: string,
    callback: (res: { success?: boolean; room?: string; error?: string }) => void
  ) => void;
  
  join_room: (
    data: { name: string; room: string },
    callback: (res: { success?: boolean; error?: string }) => void
  ) => void;
  
  start_game: (room: string) => void;
  change_mode: (data: { room: string; mode: string }) => void;
  kick_player: (data: { room: string; target: string }) => void;
  get_room_state: (room: string) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> => {
  if (!socket) {
    console.log("[SOCKET] Creating new socket instance");
    socket = io("http://localhost:3000", {
      autoConnect: false,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Add connection logging
    socket.on("connect", () => {
      console.log("[SOCKET] Connected with ID:", socket?.id);
    });
    
    socket.on("disconnect", (reason) => {
      console.log("[SOCKET] Disconnected:", reason);
    });
    
    socket.on("connect_error", (err) => {
      console.error("[SOCKET] Connection error:", err.message);
    });
  }
  return socket;
};
let connectionCount = 0;

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    connectionCount++;
    console.log(`[SOCKET] Connecting (attempt ${connectionCount})`);
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    console.log("[SOCKET] Disconnecting socket");
    socket.disconnect();
    // socket = null;
  }
};

// ---------- Promise-based Wrappers ----------

export const emitCreateRoom = (name: string): Promise<{ success?: boolean; room?: string; error?: string }> => {
  return new Promise((resolve) => {
    const s = getSocket();
    const emitWhenReady = () => {
      console.log("[DEBUG] Emitting create_room with socket ID:", s.id);
      s.emit("create_room", name, (res) => {
        console.log("[DEBUG] Server responded to create_room:", res);
        resolve(res);
      });
    };

    if (s.connected) {
      emitWhenReady();
    } else {
      console.log("[DEBUG] Waiting for connection to create room");
      s.once("connect", emitWhenReady);
      s.connect();
    }
  });
};

export const emitJoinRoom = (
  name: string,
  room: string
): Promise<{ success?: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const s = getSocket();
    const emitWhenReady = () => {
      console.log("[DEBUG] Emitting join_room for room:", room);
      s.emit("join_room", { name, room }, (res) => {
        console.log("[DEBUG] Server responded to join_room:", res);
        resolve(res);
      });
    };

    if (s.connected) {
      emitWhenReady();
    } else {
      console.log("[DEBUG] Waiting for connection to join room");
      s.once("connect", emitWhenReady);
      s.connect();
    }
  });
};

// ---------- Fire-and-Forget Events ----------

export const emitStartGame = (room: string) => {
  const s = getSocket();
  console.log("[DEBUG] Emitting start_game for room:", room);
  s.emit("start_game", room);
};

export const emitChangeMode = (room: string, mode: string) => {
  const s = getSocket();
  console.log("[DEBUG] Emitting change_mode for room:", room);
  s.emit("change_mode", { room, mode });
};

export const emitKickPlayer = (room: string, target: string) => {
  const s = getSocket();
  console.log("[DEBUG] Emitting kick_player for room:", room);
  s.emit("kick_player", { room, target });
};

export const emitGetRoomState = (room: string) => {
  const s = getSocket();
  const emitWhenReady = () => {
    console.log("[DEBUG] Emitting get_room_state for room:", room);
    s.emit("get_room_state", room);
  };

  if (s.connected) {
    emitWhenReady();
  } else {
    console.log("[DEBUG] Waiting for connection to get room state");
    s.once("connect", emitWhenReady);
    s.connect();
  }
};
