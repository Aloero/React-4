import React from "react";
import { useState } from "react";
import type { User } from "./types";
import { clearToken, getToken } from "./helpers/authStorage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";

type Tab = "login" | "profile" | "chat";

export function App() {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [tab, setTab] = useState<Tab>(token ? "chat" : "login");

  const handleLogin = (next: string, _user: User) => {
    setTokenState(next);
    setTab("chat");
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    setTab("login");
  };

  const tabs = [
    { id: "login" as Tab, label: "Вход", locked: Boolean(token) },
    { id: "profile" as Tab, label: "Профиль", locked: !Boolean(token) },
    { id: "chat" as Tab, label: "Чат", locked: !Boolean(token) },
  ];

  return (
    <>
      <div>
        <header>
          {tabs.map((item) => (
            <button key={item.id} disabled={item.locked} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
          {token ? <button onClick={handleLogout}>Выйти</button> : null }
        </header>

        {tab === "login" && !token ? <LoginPage onLogin={ handleLogin }/> : null}
        {tab === "profile" && token ? <ProfilePage token={ token }/> : null}
        {tab === "chat" && token ? <ChatPage token={ token }/> : null}
      </div>
    </>
  );
}

export default App;
