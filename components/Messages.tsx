"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef } from "react";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();

  return (
    <motion.div
      layoutScroll
      className="grow rounded-md overflow-auto p-4 bg-gray-100"
      ref={ref}
    >
      <motion.div
        className="max-w-2xl mx-auto w-full flex flex-col gap-2 pb-24"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              const isUser = msg.type === "user_message";

              // Extract the message content before the context
              const messageContent = msg.message.content.split('{')[0].trim();

              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "max-w-[70%]",
                    isUser ? "ml-auto" : "mr-auto"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2",
                      isUser ? "bg-blue-500 text-white" : "bg-white text-black"
                    )}
                  >
                    <div className="text-sm">{messageContent}</div> {/* Display only the parsed message content */}
                  </div>
                  {/*<Expressions values={msg.models.prosody?.scores ?? {}} />*/}
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
