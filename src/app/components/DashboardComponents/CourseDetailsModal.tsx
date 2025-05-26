import React from "react";
import { ICourse } from "@/app/types/course.contract";
import { useAppSelector } from "@/app/store/hooks";
import { getAccessToken } from "@/app/store/features/users/userSlice";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";

interface CourseDetailsModalProps {
  course: ICourse;
  isOpen: boolean;
  onClose: () => void;
  onStartLearning: () => void;
  progress?: number;
  status?: "active" | "completed" | "not-started";
  lessonsCompleted?: number;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onStartLearning,
  progress = 0,
  status = "not-started",
  lessonsCompleted,
}) => {
  const accessToken = useAppSelector(getAccessToken);

  const { mutate: startLearningMutation, isPending: isStarting } = useMutation({
    mutationFn: async () => {
      if (!accessToken) throw new Error("No access token");
      const response = await api.post(
        "/user-course-progress",
        { courseId: course.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      showToast("Course started!", "success");
      onStartLearning();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || "Failed to start course.";
      showToast(message, "error");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 ease-in-out sm:my-8 sm:w-full sm:max-w-4xl">
            <div className="bg-white px-6 py-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Course Details</h3>
                <button
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Course Header */}
              <div className="mt-6 flex gap-6">
                <img
                  src="/img/Course/Course.png"
                  alt={course.title}
                  className="h-48 w-64 rounded-lg object-cover shadow-md transition-transform duration-300 hover:scale-105"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#FFF5E6] px-3 py-1 text-sm font-medium text-primary">
                      {course.skillLevel}
                    </span>
                    <span className="rounded-full bg-[#FFF5E6] px-3 py-1 text-sm font-medium text-primary">
                      {course.language}
                    </span>
                    <span className="rounded-full bg-[#FFF5E6] px-3 py-1 text-sm font-medium text-primary">
                      {course.noOfLessons} Lessons
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-gray-600">{course.description}</p>

              {/* What You'll Learn */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900">What You'll Learn</h3>
                <ul className="mt-4 space-y-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="mr-2 h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
                <ul className="mt-4 space-y-2">
                  {course.requirements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="mr-2 h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Details */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900">Course Details</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Instructor</p>
                    <p className="mt-1 font-medium text-gray-900">{course.instructor}</p>
                  </div>
                  <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="mt-1 font-medium text-gray-900">{course.noOfHours} hours</p>
                  </div>
                  <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Lessons Progress</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {lessonsCompleted || 0} of {course.noOfLessons} completed
                    </p>
                  </div>
                  {/* <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Quizzes</p>
                    <p className="mt-1 font-medium text-gray-900">{course.noOfQuizzes}</p>
                  </div> */}
                  {/* <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Certificate</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {course.hasCertificate ? "Available" : "Not Available"}
                    </p>
                  </div> */}
                  <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {new Date(course.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  {/* <div className="rounded-lg bg-[#FFF5E6] p-4">
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="mt-1 font-medium text-gray-900">{course.noOfStudents}</p>
                  </div> */}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => startLearningMutation()}
                  disabled={isStarting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isStarting
                    ? "Starting..."
                    : status === "not-started"
                    ? "Start Learning"
                    : status === "completed"
                    ? "View Certificate"
                    : "Continue Learning"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
