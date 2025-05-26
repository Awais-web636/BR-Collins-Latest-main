// components/MyProfile.tsx
"use client";
import React from "react";
import ProfileSummary from "./ProfileSummary";
import ProfileContent from "./ProfileContent";

const MyProfile = () => {
  return (
    <div className="flex flex-col gap-6">
      <ProfileSummary onItemClick={() => { }} />
      <ProfileContent />
    </div>
  );
};

export default MyProfile;
