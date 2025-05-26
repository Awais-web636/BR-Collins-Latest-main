import React from "react";
import { X, BookOpen, Clock, Video, FileText, ListOrdered, Link as LinkIcon } from "lucide-react";
import { ICourseContent } from "@/app/types/course-content.contract";
import { ICourse } from "@/app/types/course.contract";

interface ViewCourseContentModalProps {
  content: ICourseContent | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewCourseContentModal: React.FC<ViewCourseContentModalProps> = ({ content, isOpen, onClose }) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Content Details</h2>
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
                <Video className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-900">{content.title}</h3>
                <p className="text-sm text-gray-500">
                  {content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Course</label>
                </div>
                <p className="text-base text-neutral-900">{(content.courseId as unknown as ICourse)?.title || "N/A"}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                </div>
                <p className="text-base text-neutral-900">{content.duration}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ListOrdered className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Order</label>
                </div>
                <p className="text-base text-neutral-900">#{content.order}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <LinkIcon className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Content URL</label>
                </div>
                <a
                  href={content.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-blue-600 hover:text-blue-700 truncate block"
                >
                  {content.contentUrl}
                </a>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-500">Description</label>
              </div>
              <p className="text-base text-neutral-900">{content.description}</p>
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

export default ViewCourseContentModal;
