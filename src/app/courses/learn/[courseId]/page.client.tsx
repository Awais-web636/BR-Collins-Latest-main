"use client";
import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { useAppSelector } from "@/app/store/hooks";
import { getAccessToken } from "@/app/store/features/users/userSlice";
import { ICourseContent } from "@/app/types/course-content.contract";
import CoursePlayer from "@/app/components/DashboardComponents/CoursePlayer";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/utils/toast";

export default function CoursePageClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const accessToken = useAppSelector(getAccessToken);

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    },
    enabled: !!accessToken && !!courseId,
  });

  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["course-content", courseId],
    queryFn: async () => {
      const response = await api.get(`/course-contents/course/${courseId}?showBlocked=false`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    },
    enabled: !!accessToken && !!courseId,
  });

  const progressQuery = useQuery({
    queryKey: ["user-course-progress", courseId],
    queryFn: async () => {
      const response = await api.get(`/user-course-progress/${courseId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    },
    enabled: !!accessToken && !!courseId,
  });

  const handleCompleteLessonMutation = useMutation({
    mutationFn: async (contentId: string) => {
      if (!accessToken) throw new Error("No access token");
      const response = await api.post(
        "/user-course-progress",
        { courseId, completedContentIds: [contentId] },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      showToast("Lesson marked as complete!", "success");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error.message || "Failed to mark lesson as complete.";
      showToast(message, "error");
    },
  });

  const completedContentIds: string[] = progressQuery.data?.completedContentIds || [];

  const firstUncompletedIndex = contentData?.findIndex((item: any) => !completedContentIds.includes(item._id)) ?? 0;

  const completionPercentage =
    contentData && contentData.length > 0 ? Math.round((completedContentIds.length / contentData.length) * 100) : 0;

  const [currentContentIndex, setCurrentContentIndex] = React.useState(firstUncompletedIndex);
  React.useEffect(() => {
    if (contentData && completedContentIds) {
      setCurrentContentIndex(firstUncompletedIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentData, completedContentIds]);

  const handleCompleteLesson = async (contentId: string) => {
    handleCompleteLessonMutation.mutate(contentId, {
      onSuccess: () => {
        // Refetch progress
        progressQuery.refetch();
      },
    });
  };

  if (courseLoading || contentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!courseData || !contentData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-800">Failed to load course content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoursePlayer
        course={courseData}
        content={contentData}
        onBack={() => router.push("/dashboard?item=enrolledCourses")}
        onCompleteLesson={handleCompleteLesson}
        completedContentIds={completedContentIds}
        currentContentIndex={currentContentIndex}
        setCurrentContentIndex={setCurrentContentIndex}
        completionPercentage={completionPercentage}
      />
    </div>
  );
}
