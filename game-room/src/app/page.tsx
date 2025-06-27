// app/page.tsx
"use client";

import Lobby from "@/components/Lobby";
import { useState } from "react";

export default function HomePage() {
  const [view, setView] = useState("lobby");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center">
      {view === "lobby" && (
        <Lobby
          setView={setView}
          setRoom={setRoom}
          setName={setName}
          setIsCreator={setIsCreator}
        />
      )}

      {/* Placeholder for room view (coming later) */}
      {view === "room" && <div>Welcome to room: {room}</div>}
    </main>
  );
}
