import React, { useState } from "react";
import { useQuery, useMutation, useQueries } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { useAppSelector } from "@/app/store/hooks";
import { getAccessToken } from "@/app/store/features/users/userSlice";
import { ICourse } from "@/app/types/course.contract";
import { IUser } from "@/app/types/user.contract";
import CourseDetailsModal from "./CourseDetailsModal";
import { useRouter } from "next/navigation";
import Pagination from "../common/Pagination";
import { showToast } from "@/app/utils/toast";

interface EnrolledCourse {
  userId: IUser;
  courseId: ICourse;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  progress: number;
  enrolledAt: string;
  status: "active" | "completed" | "not-started";
  lessonsCompleted: number;
}

const EnrolledCourses = () => {
  const router = useRouter();
  const accessToken = useAppSelector(getAccessToken);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const {
    data: enrolledCourses,
    isLoading,
    error,
  } = useQuery<EnrolledCourse[]>({
    queryKey: ["user-courses"],
    queryFn: async () => {
      const response = await api.get("/user-courses", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    },
    enabled: !!accessToken,
  });

  // Fetch progress for all enrolled courses
  const progressQueries = useQueries({
    queries:
      enrolledCourses?.map((course) => ({
        queryKey: ["user-course-progress", course.courseId._id],
        queryFn: async () => {
          const response = await api.get(`/user-course-progress/${course.courseId._id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return response.data.data;
        },
        enabled: !!accessToken && !!course.courseId._id,
      })) || [],
  });

  // Map courseId to progress percentage
  const courseProgressMap: Record<string, number> = {};
  progressQueries.forEach((q, idx) => {
    if (q.data && enrolledCourses) {
      const courseId = enrolledCourses[idx].courseId._id;
      const completed = q.data.completedContentIds?.length || 0;
      const total = q.data.totalContentCount || enrolledCourses[idx].courseId.noOfLessons || 1;
      courseProgressMap[courseId] = Math.round((completed / total) * 100);
    }
  });

  const { mutate: startLearningMutation, isPending: isStarting } = useMutation({
    mutationFn: async (courseId: string) => {
      if (!accessToken) throw new Error("No access token");
      const response = await api.post(
        "/user-course-progress",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (_data, courseId) => {
      showToast("Course started!", "success");
      router.push(`/courses/learn/${courseId}`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || "Failed to start course.";
      showToast(message, "error");
    },
  });

  const handleViewDetails = (course: EnrolledCourse) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handleStartLearning = (course: EnrolledCourse) => {
    router.push(`/courses/learn/${course.courseId._id}`);
  };

  // Pagination calculations
  const totalPages = enrolledCourses ? Math.ceil(enrolledCourses.length / coursesPerPage) : 0;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = enrolledCourses?.slice(startIndex, endIndex) || [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">My Enrolled Courses</h2>
        <div className="flex justify-center p-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">My Enrolled Courses</h2>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Failed to load enrolled courses. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!enrolledCourses?.length) {
    return (
      <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">My Enrolled Courses</h2>
        <div className="rounded-md bg-[#FFF5E6] p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary">No Courses</h3>
              <div className="mt-2 text-sm text-primary">
                <p>You haven't enrolled in any courses yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Enrolled Courses</h2>
          <p className="mt-2 text-gray-500">Track your learning progress and continue your journey</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#10B981]"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {currentCourses.map((course, idx) => {
          // Find the index of this course in enrolledCourses to get the right progress query
          const globalIdx = enrolledCourses?.findIndex((c) => c._id === course._id) ?? idx;
          const progressQuery = progressQueries[globalIdx];
          const progress = courseProgressMap[course.courseId._id] ?? course.progress ?? 0;
          return (
            <div
              key={course._id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src="/img/Course/Course.png"
                  alt={course.courseId.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        course.status === "completed" ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#FFF5E6] text-primary"
                      }`}
                    >
                      {course.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#6366F1]">
                      {course.courseId.noOfLessons} Lessons
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">{course.courseId.title}</h3>
                  <p className="text-sm text-[#6B7280]">{course.courseId.instructor}</p>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#6366F1]">
                    {course.courseId.skillLevel}
                  </span>
                  <span className="rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-medium text-[#22C55E]">
                    {course.courseId.language}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="mb-3">
                    <div className="mb-2 flex justify-between text-sm text-gray-600">
                      <span>Course Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          course.status === "completed" ? "bg-[#10B981]" : "bg-primary"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-[#6B7280]">
                      {progressQuery?.data?.completedContentIds?.length ?? course.lessonsCompleted} of{" "}
                      {progressQuery?.data?.totalContentCount ?? course.courseId.noOfLessons} lessons completed
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (progress === 0) {
                          startLearningMutation(course.courseId._id);
                        } else {
                          router.push(`/courses/learn/${course.courseId._id}`);
                        }
                      }}
                      disabled={isStarting}
                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
                        ${
                          progress === 0
                            ? "bg-primary hover:bg-primary-hover focus:ring-primary"
                            : progress === 100
                            ? "bg-green-600 hover:bg-green-700 focus:ring-green-600"
                            : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                        }`}
                    >
                      {isStarting && progress === 0
                        ? "Starting..."
                        : progress === 0
                        ? "Start Learning"
                        : progress === 100
                        ? "Course Completed"
                        : "Continue Course"}
                    </button>
                    <button
                      onClick={() => handleViewDetails(course)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#4B5563] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse.courseId}
          isOpen={!!selectedCourse}
          onClose={handleCloseModal}
          onStartLearning={() => {
            handleStartLearning(selectedCourse);
            handleCloseModal();
          }}
          progress={courseProgressMap[selectedCourse.courseId._id] ?? selectedCourse.progress ?? 0}
          lessonsCompleted={(() => {
            const idx = enrolledCourses?.findIndex((c) => c._id === selectedCourse._id) ?? -1;
            const progressQuery = progressQueries[idx];
            return progressQuery?.data?.completedContentIds?.length ?? selectedCourse.lessonsCompleted;
          })()}
          status={selectedCourse.status}
        />
      )}
    </div>
  );
};

export default EnrolledCourses;
