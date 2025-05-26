import React from "react";
import { Video, BookOpenText, ChevronDown, ChevronUp } from "lucide-react";
import {
  CourseContentBookIcon,
  DropDownIcon,
  DropUpIcon,
  HeaderBookIcon,
  VideoCameraIcon,
} from "../../../../public/icons/course_details_page_icons";
import PreviewPlayerModal from "./PreviewPlayerModal";
import { useState } from "react";

interface LectureProps {
  title: string;
  duration: string;
  type: string;
  allowPreview?: boolean;
  contentUrl: string;
  contentType: string;
}

const Lecture: React.FC<LectureProps> = ({ title, duration, type, allowPreview }) => (
  <div className="flex items-center px-5 py-2.5">
    {type === "video" ? (
      <VideoCameraIcon width={24} height={24} className="mr-2.5" color="#7B878D" strokeWidth={1.8} />
    ) : (
      <CourseContentBookIcon width={24} height={24} className="mr-2.5" color="#7B878D" strokeWidth={1.8} />
    )}
    <span className="grow text-base text-neutral-900 max-md:text-sm max-sm:text-xs flex items-center gap-2">
      {title}
    </span>
    <div className="flex items-center gap-3">
      {allowPreview && (
        <button className="px-2 py-0.5 cursor-pointer rounded text-[#2490E0] underline max-md:text-sm max-sm:text-xs font-bold">
          Preview
        </button>
      )}
      <span className="text-base text-neutral-900 max-md:text-sm max-sm:text-xs">
        {(() => {
          const minutes = parseInt(duration);
          if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMins = minutes % 60;
            return `${hours}hr ${remainingMins}min`;
          }
          return `${minutes}min`;
        })()}
      </span>
    </div>
  </div>
);

interface CourseSectionProps {
  title: string;
  stats: string;
  totalContents: number;
  totalDuration: number;
  lectures?: LectureProps[];
  expanded?: boolean;
  onToggle: () => void;
  allowPreview?: boolean;
}

export const CourseSection: React.FC<CourseSectionProps> = ({
  title,
  stats,
  totalContents,
  totalDuration,
  lectures = [],
  expanded = false,
  onToggle,
  allowPreview = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLecture, setPreviewLecture] = useState<LectureProps | null>(null);

  const handlePreview = (lecture: LectureProps) => {
    setPreviewLecture(lecture);
    setPreviewOpen(true);
  };

  return (
    <article className="mb-5 rounded-xl border border-solid bg-slate-50 border-slate-200 overflow-hidden">
      <header
        className={`flex justify-between items-center px-5 py-2.5 cursor-pointer  ${
          expanded ? "border-b border-slate-200" : ""
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <DropUpIcon width={21} height={15} className="text-neutral-500 p-1" />
          ) : (
            <DropDownIcon width={21} height={15} className="text-neutral-500 p-1" />
          )}
          <h3 className="text-lg font-semibold text-neutral-900 max-md:text-sm max-sm:text-xs ml-3 flex items-center gap-2">
            {title}
            {allowPreview && (
              <span className="ml-2 px-2 py-0.5 rounded bg-sky-100 text-sky-600 text-xs font-semibold">Preview</span>
            )}
          </h3>
        </div>
        <div className="flex items-center">
          <span className="text-base text-neutral-900 max-md:text-sm max-sm:text-xs">
            <span className="text-[#2490E0] font-medium">{totalContents} lectures</span> •{" "}
            {Math.floor(totalDuration / 60) > 0
              ? `${Math.floor(totalDuration / 60)}hr ${totalDuration % 60}min`
              : `${totalDuration}min`}
          </span>
        </div>
      </header>
      {expanded && (
        <div className="bg-white">
          {lectures.map((lecture, index) => (
            <div key={index} className="flex items-center px-5 py-2.5">
              {lecture.type === "video" ? (
                <VideoCameraIcon width={24} height={24} className="mr-2.5" color="#7B878D" strokeWidth={1.8} />
              ) : (
                <CourseContentBookIcon width={24} height={24} className="mr-2.5" color="#7B878D" strokeWidth={1.8} />
              )}
              <span className="grow text-base text-neutral-900 max-md:text-sm max-sm:text-xs flex items-center gap-2">
                Module {index + 1}: {lecture.title}
              </span>
              <div className="flex items-center gap-3">
                {lecture.allowPreview && (
                  <button
                    className="px-2 py-0.5 cursor-pointer rounded text-[#2490E0] underline max-md:text-sm max-sm:text-xs font-bold"
                    onClick={() => handlePreview(lecture)}
                  >
                    Preview
                  </button>
                )}
                <span className="text-base text-neutral-900 max-md:text-sm max-sm:text-xs">
                  {(() => {
                    const minutes = parseInt(lecture.duration);
                    if (minutes >= 60) {
                      const hours = Math.floor(minutes / 60);
                      const remainingMins = minutes % 60;
                      return `${hours}hr ${remainingMins}min`;
                    }
                    return `${minutes}min`;
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <PreviewPlayerModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        content={
          previewLecture
            ? {
                contentType: previewLecture.type,
                contentUrl: previewLecture.contentUrl,
                title: previewLecture.title,
                description: undefined,
                duration: previewLecture.duration,
              }
            : null
        }
      />
    </article>
  );
};
