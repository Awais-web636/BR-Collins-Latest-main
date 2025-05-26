"use client";
import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import { showToast } from "@/app/utils/toast";
import { createPortal } from "react-dom";

interface StatusMenuProps {
  status: "active" | "blocked";
  onStatusChange: (status: "active" | "blocked") => Promise<void>;
  disabled?: boolean;
}

const StatusMenu: React.FC<StatusMenuProps> = ({ status, onStatusChange, disabled = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"active" | "blocked" | null>(null);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isMenuOpen]);

  const handleStatusClick = (newStatus: "active" | "blocked") => {
    setPendingStatus(newStatus);
    setShowConfirmation(true);
    setIsMenuOpen(false);
  };

  const handleConfirm = async () => {
    if (pendingStatus !== null) {
      setLoading(true);
      try {
        await onStatusChange(pendingStatus);
        showToast(`User status changed to ${pendingStatus}`, "success");
      } catch (error) {
        showToast("Failed to update user status", "error");
      }
      setLoading(false);
    }
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsMenuOpen(!isMenuOpen)}
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
          status === "blocked"
            ? "text-red-600 bg-red-50 hover:bg-red-100"
            : "text-green-600 bg-emerald-50 hover:bg-emerald-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        disabled={disabled || loading}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 mr-2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        )}
        {status === "blocked" ? "Blocked" : "Active"}
        <MoreVertical className="ml-1 w-3 h-3" />
      </button>

      {isMenuOpen &&
        !disabled &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="py-0.5">
                {status === "blocked" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("active");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-green-600 hover:bg-green-50"
                  >
                    Set Active
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("blocked");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Block
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {showConfirmation &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-neutral-900">Confirm Status Change</h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-base text-neutral-900">
                      Are you sure you want to set this user as {pendingStatus === "blocked" ? "blocked" : "active"}?
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                      pendingStatus === "blocked" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-4 w-4 mr-2 inline-block text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default StatusMenu;
