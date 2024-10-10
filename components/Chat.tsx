"use client";

import { VoiceProvider, ToolCallHandler, useVoice, Channels, AudioEncoding} from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { SignIn, SignedIn, SignedOut, useUser} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { currentUser } from "@clerk/nextjs/server";

export default function ClientComponent({
  accessToken,
  configId
}: {
  accessToken: string;
  configId: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);


  const { user } = useUser();

  // uses numOfHume uses to generate a prompt whether the use is using hume for the first time or a returning user
  function generateContext(numOfHumeUses: Number, context: string, firstName: string) {
    if (numOfHumeUses === 0) {
      return `<Greeting>Welcome the user with a welcoming upbeat greeting. The user's name is ${firstName}. The user has logged in ${numOfHumeUses} times. If the user log ins is 0, you have not spoken with the user before, so add a message identifying yourself and expressing your pleasure speaking to the user for the first time. Otherwise, welcome the user back. Include the number of log ins only if it is an impressive number or you see fit<Greeting/>
              <Role>${context}<Role/><Stay Succinct>Be succinct; get straight to the point. Respond directly to the user's most recent message with only one idea per utterance. Respond in less than three sentences of under twenty words each. If you ask the user a question, please only ask one question at a time.<Stay Succinct/>`
    } else {
      return context
    }
  }

  return (
      <div className="relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px] bg-gray-100">
        <SignedIn>
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
            sessionSettings={{
              context: {
                text: (() => {
                  if (user) {
                    const { prompt: { text }, numOfHumeUses } = JSON.parse(JSON.stringify(user.publicMetadata, null, 2)) // parse hume metadata

                    return generateContext(numOfHumeUses, text, user.firstName || "");
                  }
                  return "i am a generic helper bot for zip launchpad"; // Default value if clerkMetadata is null; should not be reachable due to clerk log in required to access hume
                })(),
                type: "persistent"
              }
            }}
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
/*
// interfaces to align with types
interface ClerkMetadata {
  prompt: {
    text: string;
  };
}

interface HumeContext {
  text: string;
  type?: "persistent" | "editable" | "temporary"; // Optional enum property
}

interface SessionSettings {
  audio?: {
    channels: Channels; // Define Channels type as needed
    encoding: AudioEncoding; // Define AudioEncoding type as needed
    sampleRate: number;
  };
  context?: HumeContext; // Use your existing HumeContext interface
  languageModelApiKey?: string;
  customSessionId?: string;
  systemPrompt?: string;
  // Add any other properties that are expected
}

const sendContext = async (clerkMetadata: null | ClerkMetadata): Promise<SessionSettings> => {
  let context: HumeContext = { text: "", type: "persistent"}
  if (clerkMetadata === null) {
    context.text = "you are a doctor named Dr. Lauer"
  } else {
    const { prompt: { text }} = clerkMetadata
    context.text = text
  }

  return { context } // just return the context property
}

const createSessionSettings = (clerkMetadata: null | ClerkMetadata): SessionSettings => {
  let context: HumeContext = { text: "act as a dog support animal name luna", type: "persistent" };

  if (clerkMetadata === null) {
    context.text = "you are a doctor named Dr. Lauer";
  } else {
    const { prompt: { text } } = clerkMetadata;
    context.text = text;
  }
  console.log(context)

  // Construct the session settings object
  const sessionSettings: SessionSettings = {
    context: context
  };

  return sessionSettings;
};

/*
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
*/

  //const { status, connect } = useVoice(); // hook for hume voice state
  /*const connectStatus = useRef("disconnected"); // Create a reference for Chat
  var clerkMetadata: ClerkMetadata = { prompt: {text: ""}} // init empty
  const [sessionSettings, setSessionSettings] = useState<SessionSettings | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
        if (connectStatus.current === "connected") {
            try {
                const response = await fetch('/api/clerk/publicMetaData');
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const user = await response.json();
                if (!user) {
                    throw new Error("Clerk user not present");
                }
                const publicMetadata = user.publicMetadata;
                console.log(publicMetadata);
                clerkMetadata.prompt.text = String(publicMetadata);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    fetchUser(); // Call the inner async function
  }, [connectStatus.current]); // Dependency array to listen for changes

  /*useEffect(() => {
    const settings = createSessionSettings(clerkMetadata);
    setSessionSettings(settings);
  }, [clerkMetadata]);*/
