"use client";
import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, X } from "lucide-react";
import { createPortal } from "react-dom";
import { api } from "@/app/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/app/utils/toast";

interface AvailableSlot {
  date: string;
  availableSlots: ("half-day-morning" | "half-day-afternoon" | "full-day")[];
}

interface AppointmentStatusMenuProps {
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled";
  role?: "student" | "admin" | "manager";
  originalAppointmentType: "half-day-morning" | "half-day-afternoon" | "full-day";
  onStatusChange: (
    status: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled",
    data?: { date?: string; appointmentType?: "half-day-morning" | "half-day-afternoon" | "full-day"; reason?: string }
  ) => Promise<void>;
}

const AppointmentStatusMenu: React.FC<AppointmentStatusMenuProps> = ({
  status,
  role = "staff",
  originalAppointmentType,
  onStatusChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled" | null
  >(null);
  const [rescheduleData, setRescheduleData] = useState<{
    newDate: string;
    slot: "half-day-morning" | "half-day-afternoon" | "full-day" | undefined;
  }>({ newDate: "", slot: undefined });
  const [cancelReason, setCancelReason] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFullDayToHalfDayWarning, setShowFullDayToHalfDayWarning] = useState(false);

  // Add query for available slots
  const { data: availableSlots = [] } = useQuery({
    queryKey: ["availableSlots", currentMonth],
    queryFn: async () => {
      // Only fetch slots for the current month being displayed
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const startDate = firstDayOfMonth.toISOString().split("T")[0];
      const endDate = lastDayOfMonth.toISOString().split("T")[0];

      const response = await api.get(`/appointments/available-slots?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data;
    },
    enabled: currentMonth >= new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  });

  // Function to check if a slot is available
  const isSlotAvailable = (slotType: "half-day-morning" | "half-day-afternoon" | "full-day") => {
    if (!rescheduleData.newDate || !availableSlots.length) {
      return false;
    }

    const selectedDateObj = new Date(rescheduleData.newDate);
    const formattedDate = selectedDateObj.toISOString().split("T")[0];
    const dateSlots = availableSlots.find((slot: AvailableSlot) => slot.date === formattedDate);
    return dateSlots?.availableSlots?.includes(slotType) || false;
  };

  // Helper to determine allowed slot options
  const getAllowedSlots = () => {
    if (originalAppointmentType === "full-day") {
      return ["half-day-morning", "half-day-afternoon", "full-day"];
    } else {
      return ["half-day-morning", "half-day-afternoon"];
    }
  };

  // Helper to check if warning is needed
  const isFullDayToHalfDay = () => {
    return (
      originalAppointmentType === "full-day" &&
      (rescheduleData.slot === "half-day-morning" || rescheduleData.slot === "half-day-afternoon")
    );
  };

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

  const handleStatusClick = (newStatus: "scheduled" | "in-progress" | "completed" | "cancelled" | "rescheduled") => {
    setPendingStatus(newStatus);
    setShowConfirmation(true);
    setIsMenuOpen(false);
  };

  const handleConfirm = async () => {
    if (pendingStatus === "rescheduled" && isFullDayToHalfDay() && !showFullDayToHalfDayWarning) {
      setShowFullDayToHalfDayWarning(true);
      return;
    }
    if (pendingStatus !== null) {
      try {
        if (pendingStatus === "rescheduled") {
          await onStatusChange(pendingStatus, {
            date: rescheduleData.newDate,
            appointmentType: rescheduleData.slot,
          });
        } else if (pendingStatus === "cancelled") {
          await onStatusChange(pendingStatus, { reason: cancelReason });
        } else {
          await onStatusChange(pendingStatus);
        }
        showToast("Appointment status updated to " + pendingStatus, "success");
      } catch (error) {
        showToast("Failed to update appointment status", "error");
      }
    }
    setShowConfirmation(false);
    setPendingStatus(null);
    setRescheduleData({ newDate: "", slot: undefined });
    setCancelReason("");
    setShowFullDayToHalfDayWarning(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
    setRescheduleData({ newDate: "", slot: undefined });
    setCancelReason("");
  };

  if (!mounted) return null;

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClass = () => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-50 hover:bg-blue-100";
      case "in-progress":
        return "text-orange-600 bg-orange-50 hover:bg-orange-100";
      case "completed":
        return "text-green-600 bg-emerald-50 hover:bg-emerald-100";
      case "cancelled":
        return "text-red-600 bg-red-50 hover:bg-red-100";
      case "rescheduled":
        return "text-purple-600 bg-purple-50 hover:bg-purple-100";
      default:
        return "text-gray-600 bg-gray-50 hover:bg-gray-100";
    }
  };

  const renderConfirmationContent = () => {
    if (pendingStatus === "rescheduled") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-base text-neutral-900">Are you sure you want to reschedule this appointment?</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
              <input
                type="date"
                value={rescheduleData.newDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setRescheduleData({ ...rescheduleData, newDate, slot: undefined });
                  // Update current month when date changes for fetching available slots
                  const selectedDate = new Date(newDate);
                  setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                value={rescheduleData.slot || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setRescheduleData({
                    ...rescheduleData,
                    slot: value === "" ? undefined : (value as "half-day-morning" | "half-day-afternoon" | "full-day"),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a time slot</option>
                {getAllowedSlots().includes("half-day-morning") && (
                  <option value="half-day-morning" disabled={!isSlotAvailable("half-day-morning")}>
                    Morning (8:00 AM - 12:00 PM)
                  </option>
                )}
                {getAllowedSlots().includes("half-day-afternoon") && (
                  <option value="half-day-afternoon" disabled={!isSlotAvailable("half-day-afternoon")}>
                    Afternoon (1:00 PM - 5:00 PM)
                  </option>
                )}
                {getAllowedSlots().includes("full-day") && (
                  <option value="full-day" disabled={!isSlotAvailable("full-day")}>
                    Full Day (8:00 AM - 5:00 PM)
                  </option>
                )}
              </select>
            </div>
            {rescheduleData.newDate && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Availability Status:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {!isSlotAvailable("half-day-morning") && (
                    <>
                      <li className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        Morning Slot is not available
                      </li>
                      {!isSlotAvailable("full-day") && (
                        <li className="flex items-center">
                          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                          Full Day is unavailable (morning is booked)
                        </li>
                      )}
                    </>
                  )}
                  {!isSlotAvailable("half-day-afternoon") && (
                    <>
                      <li className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        Afternoon Slot is not available
                      </li>
                      {!isSlotAvailable("full-day") && (
                        <li className="flex items-center">
                          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                          Full Day is unavailable (afternoon is booked)
                        </li>
                      )}
                    </>
                  )}
                  {isSlotAvailable("half-day-morning") &&
                    isSlotAvailable("half-day-afternoon") &&
                    isSlotAvailable("full-day") && (
                      <li className="flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        All time slots are available
                      </li>
                    )}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    } else if (pendingStatus === "cancelled") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-base text-neutral-900">Are you sure you want to cancel this appointment?</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Please provide a reason for cancellation..."
              required
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-base text-neutral-900">
            Are you sure you want to change the appointment status to {pendingStatus}?
          </p>
        </div>
      );
    }
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
                {/* {role === "admin" && status !== "scheduled" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("scheduled");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                  >
                    Scheduled
                  </button>
                )} */}
                {/* {role === "admin" && status !== "completed" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("completed");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-green-600 hover:bg-green-50"
                  >
                    Complete
                  </button>
                )} */}
                {status !== "cancelled" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("rescheduled");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-purple-600 hover:bg-purple-50"
                  >
                    Reschedule
                  </button>
                )}
                {status !== "cancelled" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusClick("cancelled");
                    }}
                    className="flex items-center w-full px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Cancel
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

                {renderConfirmationContent()}

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={
                      (pendingStatus === "rescheduled" && !rescheduleData.newDate) ||
                      (pendingStatus === "cancelled" && !cancelReason)
                    }
                    className={`px-4 py-2 text-sm font-medium text-white ${
                      pendingStatus === "rescheduled"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : pendingStatus === "cancelled"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {showFullDayToHalfDayWarning &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-neutral-900">Warning</h2>
                  <button
                    onClick={() => setShowFullDayToHalfDayWarning(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                  <p className="text-base text-yellow-900">
                    You are rescheduling a full-day appointment to a half-day slot. Are you sure you want to proceed?
                  </p>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowFullDayToHalfDayWarning(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Proceed
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

export default AppointmentStatusMenu;
