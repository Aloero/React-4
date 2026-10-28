import React from "react";
import type { Message } from "../types";

type Props = {
  messages: Message[];
};

export function MessageList({ messages }: Props) {
  if (!messages?.length) {
    return <p>Нет сообщений</p>;
  }

  return (
    <div>
        {messages.map((message) => (
          <div key={message.id}>
            <span>{message.author}</span>
            <span>{message.text}</span>
            <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
    </div>
  )
}

export default MessageList;
