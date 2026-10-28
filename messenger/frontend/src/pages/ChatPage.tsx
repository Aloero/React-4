import React, { useEffect, useState } from "react";
import type { Message } from "../types";
import { getMessages, sendMessage } from "../api/messageApi";
import { connectSocket } from "../api/socketClient";
import { handleError } from "../helpers/handleError";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";

type Props = {
  token: string;
};

export function ChatPage({ token }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [socketStatus, setSocketStatus] = useState<string>("disconnected");
  const [socketClient, setSocketClient] = useState<any>(null);

  const addMessage = (message: Message) => {
    setMessages((prev) =>
      prev.some((item) => item.id === message.id) ? prev : [...prev, message]
    );
  };

  useEffect(() => {
    let active = true;
    let client: ReturnType<typeof connectSocket> | null = null;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const history = await getMessages(token);
        if (!active) return;

        setMessages(history);

        client = connectSocket(token, {
          onMessage: (message) => {
            if (active) addMessage(message);
          },
          onStatus: (status) => {
            if (active) setSocketStatus(status);
          }
        });

        setSocketClient(client);
      } catch (e) {
        if (active) setError(handleError(e));
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
      setSocketClient(null);
      client?.disconnect();
    };
  }, [token]);

  const handleSend = async (text: string) => {
    try {
      const message = await sendMessage(token, text);
      addMessage(message);
    } catch (e) {
      setError(handleError(e));
    }
  };

  return (
    <div>
      <h2>Чат</h2>
      <p>Статус сокета: {socketStatus}</p>
      {loading ? <p>Загрузка сообщений...</p> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <MessageList messages={messages} />
      <MessageInput onSend={ handleSend } disabled={ socketStatus !== "connected" || loading } />
    </div>
  );
}

export default ChatPage;
