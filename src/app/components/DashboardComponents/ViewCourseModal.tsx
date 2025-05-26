import React from "react";
import { X, BookOpen, Clock, Users, Star, DollarSign, Award, BarChart, Calendar, FileText } from "lucide-react";
import { ICourse } from "@/app/types/course.contract";

interface ViewCourseModalProps {
  course: ICourse | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({ course, isOpen, onClose }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Course Details</h2>
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
                <h3 className="text-lg font-medium text-neutral-900">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.subtitle || "Course Title"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Instructor</label>
                </div>
                <p className="text-base text-neutral-900">{course.instructor}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                </div>
                <p className="text-base text-neutral-900">{course.rating} / 5</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                </div>
                <p className="text-base text-neutral-900">
                  {course.noOfHours} hours ({course.noOfLessons} lessons)
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Price</label>
                </div>
                <p className="text-base text-neutral-900">
                  ${course.price}
                  {course.isDiscounted && (
                    <span className="ml-2 text-sm text-gray-500 line-through">${course.discountPrice}</span>
                  )}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Level & Certificate</label>
                </div>
                <p className="text-base text-neutral-900">
                  {course.skillLevel}
                  {course.hasCertificate && " • Certificate Available"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-500">Status</label>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    course.isPublished
                      ? "text-green-600 bg-emerald-50"
                      : course.isArchived
                      ? "text-gray-600 bg-gray-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {course.isPublished ? "Published" : course.isArchived ? "Archived" : "Draft"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-500">Overview</label>
              </div>
              <p className="text-base text-neutral-900">{course.overview}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-500">Course Timeline</label>
              </div>
              <div className="space-y-1">
                <p className="text-base text-neutral-900">
                  Start Date:{" "}
                  {(course.startDate ? new Date(course.startDate) : new Date()).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-base text-neutral-900">
                  Last Updated:{" "}
                  {(course.lastUpdated ? new Date(course.lastUpdated) : new Date()).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
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

export default ViewCourseModal;
