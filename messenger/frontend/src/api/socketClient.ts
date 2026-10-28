import type { Message } from "../types";

const WS_URL = import.meta.env?.VITE_WS_URL || "ws://localhost:3001";

type SocketCallbacks = {
  onMessage?: (message: Message) => void;
  onStatus?: (status: string) => void;
};

export function connectSocket(token: string, { onMessage, onStatus }: SocketCallbacks) {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    onStatus?.("connected");
  };

  socket.onerror = () => {
    onStatus?.("disconnected");
  };

  socket.onclose = () => {
    onStatus?.("disconnected");
  };

  socket.onmessage = (event) => {
    let data: { type?: string; payload?: Message };

    try {
      data = JSON.parse(event.data as string);
    } catch {
      return;
    }

    if (data.type === "message:new") {
      onMessage?.(data.payload);
    }
  };

  return {
    sendMessage: (text: string) => {
      socket.send(JSON.stringify({ type: "message:send", payload: { text, token } }));
    },
    disconnect: () => {
      socket.close();
    }
  };
}
