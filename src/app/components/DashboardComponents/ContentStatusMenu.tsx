"use client";
import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import { showToast } from "@/app/utils/toast";
import { createPortal } from "react-dom";

interface ContentStatusMenuProps {
  status: "active" | "blocked";
  onStatusChange: (status: "active" | "blocked") => Promise<void>;
}

const ContentStatusMenu: React.FC<ContentStatusMenuProps> = ({ status, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<"active" | "blocked" | null>(null);
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

  const handleStatusClick = (status: "active" | "blocked") => {
    setPendingStatus(status);
    setShowConfirmation(true);
    setIsMenuOpen(false);
  };

  const handleConfirm = async () => {
    if (pendingStatus !== null) {
      try {
        await onStatusChange(pendingStatus);
        showToast(
          pendingStatus === "blocked" ? "Content blocked successfully" : "Content unblocked successfully",
          "success"
        );
      } catch (error) {
        showToast("Failed to update content status", "error");
      }
    }
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  if (!mounted) return null;

  const getStatusText = () => {
    return status === "blocked" ? "Blocked" : "Active";
  };

  const getStatusClass = () => {
    return status === "blocked"
      ? "text-red-600 bg-red-50 hover:bg-red-100"
      : "text-green-600 bg-emerald-50 hover:bg-emerald-100";
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${getStatusClass()}`}
      >
        {getStatusText()}
        <MoreVertical className="ml-1 w-3 h-3" />
      </button>

      {isMenuOpen &&
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
                {status !== "blocked" && (
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
                {status === "blocked" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("active");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-green-600 hover:bg-green-50"
                  >
                    Unblock
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
                      Are you sure you want to {pendingStatus === "blocked" ? "block" : "unblock"} this content?
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
                  >
                    Confirm
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

export default ContentStatusMenu;
