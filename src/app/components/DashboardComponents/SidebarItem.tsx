"use client";
import React from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  isActive?: boolean;
  isLogout?: boolean;
  collapsed?: boolean;
  onClick: () => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  isLogout = false,
  collapsed = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
        isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-700"
      } ${isLogout ? "mt-2" : "mb-2"} ${collapsed ? "justify-center" : "justify-start"} ${className}`}
    >
      <Icon className={`${isActive ? "text-blue-600" : "text-gray-500"} w-5 h-5`} />
      {!collapsed && <span className={`ml-3 ${isLogout ? "text-red-500" : ""}`}>{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </div>
      )}
    </button>
  );
};

export default SidebarItem;
