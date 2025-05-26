// components/ProfileContent.tsx
"use client";
import React from "react";
import ProfileField from "./ProfileField";

interface ProfileContentProps {
  registrationDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  biography?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  registrationDate = "February 22, 2025",
  firstName = "Charlotte",
  lastName = "Anderson",
  email = "charlotte675@gmail.com",
  biography = "Hi, I'm Charlotte Anderson...",
}) => {
  return (
    <section className="mt-10 max-md:max-w-full bg-white rounded-xl shadow-sm p-6">
      {/* Content exactly as you had it */}
      <div className="flex gap-10 max-w-full">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-neutral-900 max-md:mr-2.5">
            My Profile
          </h2>
          <p className="mt-4 text-base text-gray-500">Registration Date</p>
        </div>
        <p className="self-end mt-8 text-base text-neutral-900 max-md:mt-6">
          {registrationDate}
        </p>
      </div>

      <hr className="shrink-0 mt-6 h-px bg-gray-200 border-0 max-md:max-w-full" />

      <ProfileField label="First Name" value={firstName} />
      <ProfileField label="Last Name" value={lastName} />

      <hr className="shrink-0 mt-6 h-px bg-gray-200 border-0 max-md:max-w-full" />

      <div className="flex gap-5 justify-between mt-5 max-w-full text-base">
        <p className="text-gray-500">Email</p>
        <a href={`mailto:${email}`} className="text-sky-500 underline">
          {email}
        </a>
      </div>

      <hr className="shrink-0 mt-6 h-px bg-gray-200 border-0 max-md:max-w-full" />

      <div className="flex flex-col gap-4 mt-5 text-base max-md:max-w-full">
        <p className="text-gray-500">Biography</p>
        <p className="leading-6 text-neutral-900 max-md:max-w-full">
          {biography}
        </p>
      </div>
    </section>
  );
};

export default ProfileContent;