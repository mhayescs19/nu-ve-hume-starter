"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import { cn } from "@/utils";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute } = useVoice();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4",
        "bg-gray-100 flex justify-center items-center"
      )}
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="bg-white rounded-full shadow-sm flex items-center gap-4 p-2"
          >
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
              className="rounded-full p-2"
            >
              {isMuted ? (
                <MicOff className="size-6" />
              ) : (
                <Mic className="size-6" />
              )}
            </Toggle>

            <Button
              className="rounded-full p-2 bg-red-500 text-white"
              onClick={() => {
                disconnect();
              }}
              variant="ghost"
            >
              End Call
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
