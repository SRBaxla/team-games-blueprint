// components/RoomCodeModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface RoomCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (roomCode: string) => void;
}

export function RoomCodeModal({ open, onOpenChange, onJoin }: RoomCodeModalProps) {
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = () => {
    if (!roomCode.trim()) {
      toast.error("Please enter a room code.");
      return;
    }

    onJoin(roomCode.trim());
    onOpenChange(false); // Close the modal
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#1a2d25] p-6 text-white shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">Enter Room Code</Dialog.Title>
          <Input
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleSubmit}>Join</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
