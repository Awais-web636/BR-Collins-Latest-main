import React from "react";

interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
  return (
    <div className="flex gap-5 justify-between mt-5 max-w-full text-lg w-[301px]">
      <p className="text-gray-500">{label}</p>
      <p className="text-neutral-900">{value}</p>
    </div>
  );
};

export default ProfileField;
