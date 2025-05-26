"use client";
import React from "react";
import { X, BookOpen, FileText, Calendar } from "lucide-react";

interface ViewCourseCategoryModalProps {
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ViewCourseCategoryModal: React.FC<ViewCourseCategoryModalProps> = ({ category, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Category Details</h2>
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
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">{category.name}</h3>
                <p className="text-sm text-gray-500">Category Name</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Description</label>
                </div>
                <p className="text-base text-neutral-900">{category.description}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                </div>
                <p className="text-base text-neutral-900">{new Date(category.createdAt).toLocaleDateString()}</p>
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

export default ViewCourseCategoryModal;
