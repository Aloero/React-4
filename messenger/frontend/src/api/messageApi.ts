import type { Message } from "../types";
import axios from "axios";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

export async function getMessages(token: string): Promise<Message[]> {
  const res = await fetch(API_URL + "/messages", { headers: authHeaders(token) });
  const raw = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (raw as { message?: string } | null)?.message;
    throw new Error(message || `Error request: ${res.status}`);
  }

  if (!Array.isArray(raw)) {
    throw new Error("Not array response");
  }

  return raw as Message[];
}

export async function sendMessage(token: string, text: string): Promise<Message> {
  const res = await axios.post<Message>(API_URL + "/messages", { text }, { headers: authHeaders(token) });
  return res.data;
}
