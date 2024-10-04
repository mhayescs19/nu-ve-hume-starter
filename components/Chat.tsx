"use client";

import { VoiceProvider, ToolCallHandler } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

// function from Hume function next example: https://github.com/HumeAI/hume-api-examples/blob/main/evi-next-js-function-calling/app/components/ClientComponent.tsx
const handleToolCall: ToolCallHandler = async (
  message,
  send,
) => {
  if (message.name === 'create_notification') {
    try {
      const response = await fetch('/api/createNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters: message.parameters }),
      });

      const result = await response.json(); // result is just the message that evi is going to create

      console.log(result);

      if (result.success) {
        return send.success(result.data);
      } else {
        return send.error(result.error);
      }
    } catch (error) {
      return send.error({
        error: 'Notification tool error',
        code: 'create_notification_error',
        level: 'warn',
        content: 'There was an error with the create notification tool',
      });
    }
  }

  return send.error({
    error: 'Tool not found',
   code: 'tool_not_found',
   level: 'warn',
   content: 'The tool you requested was not found',
 });
};

export default function ClientComponent({
  accessToken,
  configId
}: {
  accessToken: string;
  configId: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  
  return (
      <div className="relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px] bg-gray-100">
        <SignedIn>
          {/*<div className="bg-gray-200 p-4 text-center font-semibold">
            AI Assistant
          </div>*/}
          <VoiceProvider
            auth={{ type: "accessToken", value: accessToken }}
            onMessage={() => {
              if (timeout.current) {
                window.clearTimeout(timeout.current);
              }

              timeout.current = window.setTimeout(() => {
                if (ref.current) {
                  const scrollHeight = ref.current.scrollHeight;

                  ref.current.scrollTo({
                    top: scrollHeight,
                    behavior: "smooth",
                  });
                }
              }, 200);
            }}
            configId={configId}
            onToolCall={handleToolCall}
          >
            <Messages ref={ref} />
            <Controls />
            <StartCall />
          </VoiceProvider>
        </SignedIn>
        <div className="flex items-center justify-center pt-5">
          <SignedOut>
            <SignIn routing="hash">
            </SignIn>
          </SignedOut>
        </div>
        
    </div>
    

    
  );
}
