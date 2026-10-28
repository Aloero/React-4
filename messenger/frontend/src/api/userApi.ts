import type { User } from "../types";
import axios from "axios";

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

export async function getProfile(token: string): Promise<User> {
  const res = await fetch(API_URL + "/users/me", { headers: authHeaders(token) });

  const raw = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (raw as { message?: string } | null)?.message;
    throw new Error(message || `Error request: ${res.status}`);
  }

  if (!raw) {
    throw new Error("Not fill response");
  }

  return raw as User;
}

export type UpdateProfilePayload = Partial<Pick<User, "nickname" | "bio">>;

export async function updateProfile(token: string, { nickname, bio }: UpdateProfilePayload): Promise<User> {
  const res = await axios.put<User>(API_URL + "/users/me", { nickname, bio }, { headers: authHeaders(token) });
  return res.data;
}
