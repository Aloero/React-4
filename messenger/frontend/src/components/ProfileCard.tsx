import React from "react";
import type { User } from "../types";

type Props = {
  profile: User | null;
};

export function ProfileCard({ profile }: Props) {
  if (!profile) return null;

  return (
    <div>
      <span>{profile.nickname}</span>
      <span>{profile.phone}</span>
      <span>{profile.bio}</span>
    </div>
  );
}

export default ProfileCard;
