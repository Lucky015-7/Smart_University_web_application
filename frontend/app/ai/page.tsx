'use client';
import { convertToModelMessages, type ToolUIPart } from 'ai';

import { useChat } from '@ai-sdk/react';
import {
  toBaseMessages, toUIMessageStream, LangSmithDeploymentTransportOptions, LangSmithDeploymentTransport
} from '@ai-sdk/langchain';
import { useMemo } from 'react';
import { FixedLangGraphTransport } from '@/lib/FixedLangGraphTransport';

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";



import { useState } from "react";
import {
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { MessageResponse } from "@/components/ai-elements/message";
import { RefreshCcwIcon, CopyIcon } from "lucide-react";

import { Fragment } from "react";
import { Card } from '@/components/ui/card';
import { Ai_CampusResource_toolbox } from '@/components/custom/Ai_CampusResource_toolbox';




export default function LangSmithChat() {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new FixedLangGraphTransport({
        url: 'http://host.docker.internal:2024',
        graphId: 'agent',
      }),
    [],
  );


  const { messages, sendMessage, status, regenerate } = useChat({
    transport,
  });

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim()) {
      sendMessage({ text: message.text });
      setInput("");
    }
  };

  const placeholders = [
    "Show me available resources?",
    "what are the projectors available.",
  ];



  return (
    <div className=" mx-auto max-w-7xl p-6 relative size-full rounded-lg  h-[90dvh]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message, messageIndex) => {
              console.log("Full Message Object:", message);
              return (

                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    // console.log("parts"+part)
                    // console.log(part.type)
                    console.log(`Part ${i} for message ${message.id}:`, part);
                    if (part.type === "dynamic-tool") {
                      console.log("Dynamic Tool Part:", part);
                    }
                    switch (part.type) {
                      case "text":
                        const isLastMessage =
                          messageIndex === messages.length - 1;

                        return (
                          <Fragment key={`${message.id}-${i}`}>
                            <Message from={message.role}>
                              <MessageContent>
                                <MessageResponse>{part.text}</MessageResponse>
                              </MessageContent>
                            </Message>
                            {message.role === "assistant" && isLastMessage && (
                              <MessageActions>
                                <MessageAction
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </MessageAction>
                                <MessageAction
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </MessageAction>
                              </MessageActions>
                            )}
                          </Fragment>
                        );
                      case 'dynamic-tool':
                        return (
                          <div>
                            <h4>Tool: {part.toolName}</h4>
                            {/* <pre>{JSON.stringify(part.output, null, 2)}</pre> */}
                          </div>
                        );
                        default:
                          return null;
                    }
                  })}
                </Fragment>
              );
            }
            
          )}
            
          <Ai_CampusResource_toolbox  />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >

          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>

      </div>
    </div>
  );
}




// curl -X POST http://host.docker.internal:2024/runs/stream \
//   -H "Content-Type: application/json" \
//   -d '{
//     "assistant_id": "agent",
//     "if_not_exists": "create",
//     "input": {
//       "messages": [
//         {
//           "role": "human",
//           "content": "Hello, LangGraph!"
//         }
//       ]
//     },
//     "stream_mode": ["values", "messages-tuple"]
//   }'



// const ResourceCards = ({ resources }: { resources: CampusResource[] }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//     {resources.map((item) => (
//       <Card key={item.id} className="p-4 shadow-sm border-l-4 border-l-primary">
//         <div className="flex justify-between items-start">
//           <h4 className="font-bold text-lg">{item.name}</h4>
//           <span className={`text-xs px-2 py-1 rounded ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//             {item.status}
//           </span>
//         </div>
//         <p className="text-sm text-muted-foreground">{item.location}</p>
//         <div className="mt-2 flex gap-4 text-xs font-medium">
//           <span>Type: {item.type}</span>
//           {item.capacity && <span>Capacity: {item.capacity}</span>}
//         </div>
//       </Card>
//     ))}
//   </div>
// );