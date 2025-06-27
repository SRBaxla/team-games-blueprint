// src/components/WelcomeScreen.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export default function WelcomeScreen() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleStart = (mode: "single" | "multiplayer") => {
    if (!name.trim()) {
      setError("Please enter a guest name.")
      return
    }

    localStorage.setItem("guestName", name)
    router.push(mode === "single" ? "/character" : "/multiplayer")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-white">Rock Paper Showdown</h1>
          <Input
            placeholder="Enter guest name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError("")
            }}
            className="text-black"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex flex-col gap-4">
            <Button onClick={() => handleStart("single")} className="w-full">
              🎮 Single Player
            </Button>
            <Button onClick={() => handleStart("multiplayer")} variant="outline" className="w-full">
              🌐 Multiplayer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
