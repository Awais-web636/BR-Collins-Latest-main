import React from "react";
import { X, Calendar, Clock, AlertCircle, Repeat } from "lucide-react";
import { IAdminOffDay } from "@/app/types/admin.contract";

interface ViewOffDayModalProps {
  offDay: IAdminOffDay | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ViewOffDayModal: React.FC<ViewOffDayModalProps> = ({ offDay, isOpen, onClose, onDelete }) => {
  if (!isOpen || !offDay || !offDay._id) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this off day?")) {
      onDelete(offDay._id);
    }
  };

  const formatTimeSlot = (slot: "half-day-morning" | "half-day-afternoon") => {
    return slot === "half-day-morning" ? "Morning (8:00 AM - 12:00 PM)" : "Afternoon (1:00 PM - 5:00 PM)";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Off Day Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Date */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-500">Date</label>
              </div>
              <p className="text-base text-neutral-900">{new Date(offDay.date).toLocaleDateString()}</p>
            </div>

            {/* Disabled Slots */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-500">Disabled Time Slots</label>
              </div>
              <div className="space-y-2">
                {offDay.disabledSlots.map((slot, index) => (
                  <p key={index} className="text-base text-neutral-900">
                    {formatTimeSlot(slot)}
                  </p>
                ))}
              </div>
            </div>

            {/* Reason */}
            {offDay.reason && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Reason</label>
                </div>
                <p className="text-base text-neutral-900">{offDay.reason}</p>
              </div>
            )}

            {/* Recurring Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Repeat className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-500">Recurring</label>
              </div>
              <p className="text-base text-neutral-900">{offDay.isRecurring ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOffDayModal;
