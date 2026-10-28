import React, { useEffect, useState } from "react";
import type { User } from "../types";
import { getProfile, updateProfile } from "../api/userApi";
import { handleError } from "../helpers/handleError";
import { ProfileCard } from "../components/ProfileCard";

type Props = {
  token: string;
};

export function ProfilePage({ token }: Props) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [nickname, setNickname] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProfile(token);
        if (!active) {
          return;
        };
        setProfile(data);
        setNickname(data.nickname);
        setBio(data.bio);
      } catch (e) {
        if (active) setError(handleError(e));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [token]);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await updateProfile(token, { nickname, bio });
      setProfile(data);
      setNickname(data.nickname);
      setBio(data.bio);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Профиль</h2>
      {loading && <p>Загрузка...</p>}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      <ProfileCard profile={profile} />
      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Ник" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Описание" />
        <button onClick={handleSave} disabled={loading}>
          Сохранить
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
