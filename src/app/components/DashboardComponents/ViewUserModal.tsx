import React from "react";
import { IUser } from "@/app/types/user.contract";
import { transformUserType } from "@/app/utils/string-manipulation/transform-user-type";
import { X, User, Mail, Shield, Calendar, Activity } from "lucide-react";

interface ViewUserModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500">Full Name</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Email</label>
                </div>
                <p className="text-base text-neutral-900">{user.email}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Role</label>
                </div>
                <p className="text-base text-neutral-900">{transformUserType(user.role)}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Status</label>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    user.status === "active"
                      ? "text-green-600 bg-emerald-50"
                      : user.status === "blocked"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 bg-gray-50"
                  }`}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Created</label>
                </div>
                <p className="text-base text-neutral-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
