import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  FileText,
  Link as LinkIcon,
  Menu,
  X,
} from "lucide-react";
import { ICourse } from "@/app/types/course.contract";
import { ICourseContent } from "@/app/types/course-content.contract";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";

interface CoursePlayerProps {
  course: ICourse;
  content: ICourseContent[];
  onBack: () => void;
  onCompleteLesson: (contentId: string) => void;
  completedContentIds: string[];
  currentContentIndex: number;
  setCurrentContentIndex: React.Dispatch<React.SetStateAction<number>>;
  completionPercentage: number;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  content,
  onBack,
  onCompleteLesson,
  completedContentIds,
  currentContentIndex,
  setCurrentContentIndex,
  completionPercentage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // If all lessons are completed, always start from the first lesson
  useEffect(() => {
    if (content && completedContentIds && content.length > 0 && completedContentIds.length === content.length) {
      setCurrentContentIndex(0);
    }
  }, [content, completedContentIds, setCurrentContentIndex]);

  // Prevent out-of-bounds access
  const safeContentIndex = currentContentIndex >= 0 && currentContentIndex < content.length ? currentContentIndex : 0;
  const currentContent = content[safeContentIndex];

  const handlePrevious = () => {
    if (safeContentIndex > 0) {
      setCurrentContentIndex(safeContentIndex - 1);
    }
  };

  const handleNext = () => {
    if (safeContentIndex < content.length - 1) {
      setCurrentContentIndex(safeContentIndex + 1);
    }
  };

  const handleCompleteLesson = () => {
    if (!completedContentIds.includes(currentContent._id)) {
      onCompleteLesson(currentContent._id);
    }
  };

  // useEffect(() => {
  //   if (content && completedContentIds && content.length > 0 && completedContentIds.length === content.length) {
  //     router.push("/dashboard?item=enrolledCourses");
  //   }
  // }, [completedContentIds, content, router]);

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      {/* Top Navigation */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Courses
            </button>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-500">
                Lesson {safeContentIndex + 1} of {content.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-lg bg-white p-2 shadow-sm md:flex">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                <span className="text-sm text-gray-600">{completionPercentage}% Complete</span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 md:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-16 flex flex-1">
        {/* Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:mr-80" : ""}`}>
          <div className="mx-auto max-w-4xl px-4 py-6">
            <div className="overflow-hidden rounded-xl bg-black shadow-lg">
              {currentContent.contentType === "video" ? (
                <div className="relative aspect-video">
                  <ReactPlayer
                    url={currentContent.contentUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                    className="absolute top-0 left-0"
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                          onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex h-[400px] items-center justify-center bg-white p-8">
                  <div className="max-w-2xl text-center">
                    <div className="mb-6 flex justify-center">
                      {currentContent.contentType === "document" ? (
                        <FileText className="h-16 w-16 text-gray-400" />
                      ) : (
                        <LinkIcon className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <h4 className="mb-4 text-xl font-semibold text-gray-900">{currentContent.title}</h4>
                    <p className="mb-6 text-gray-600">{currentContent.description}</p>
                    <a
                      href={currentContent.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
                    >
                      {currentContent.contentType === "document" ? "View Document" : "Open Resource"}
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">{currentContent.title}</h3>
              <p className="text-gray-600">{currentContent.description}</p>
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={safeContentIndex === 0}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous Lesson
              </button>
              <button
                onClick={handleCompleteLesson}
                disabled={completedContentIds.includes(currentContent._id)}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
              >
                {completedContentIds.includes(currentContent._id) ? "Completed" : "Mark as Complete"}
              </button>
              <button
                onClick={handleNext}
                disabled={safeContentIndex === content.length - 1}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Next Lesson
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed bottom-0 right-0 top-16 z-40 w-80 transform overflow-y-auto border-l bg-white transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="sticky top-0 z-10 border-b bg-white p-4">
            <h4 className="text-lg font-medium text-gray-900">Course Content</h4>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {completedContentIds.length} of {content.length} lessons completed
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {content.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => setCurrentContentIndex(index)}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors duration-200 ${
                    safeContentIndex === index
                      ? "bg-primary text-white"
                      : completedContentIds.includes(item._id)
                      ? "bg-orange-50 text-gray-900"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      safeContentIndex === index ? "bg-white/10" : "bg-white shadow-sm"
                    }`}
                  >
                    {completedContentIds.includes(item._id) ? (
                      <CheckCircle
                        className={`h-4 w-4 ${safeContentIndex === index ? "text-white" : "text-green-500"}`}
                      />
                    ) : item.contentType === "video" ? (
                      <BookOpen className="h-4 w-4" />
                    ) : item.contentType === "document" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${safeContentIndex === index ? "text-white" : "text-gray-900"}`}
                    >
                      {item.title}
                    </p>
                    <p className={`text-xs ${safeContentIndex === index ? "text-white/80" : "text-gray-500"}`}>
                      {item.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
