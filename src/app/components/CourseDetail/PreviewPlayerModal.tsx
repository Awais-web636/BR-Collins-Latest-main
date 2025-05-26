import React from "react";
import { X, FileText, Link as LinkIcon, Video } from "lucide-react";
import ReactPlayer from "react-player";

interface PreviewPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    contentType: string;
    contentUrl: string;
    title: string;
    description?: string;
    duration?: string;
  } | null;
}

const iconBg = {
  video: "bg-sky-100 text-sky-600",
  document: "bg-orange-100 text-orange-500",
  link: "bg-green-100 text-green-600",
};

const iconMap = {
  video: Video,
  document: FileText,
  link: LinkIcon,
};

const PreviewPlayerModal: React.FC<PreviewPlayerModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  const Icon = iconMap[content.contentType as keyof typeof iconMap] || Video;
  const iconBgClass = iconBg[content.contentType as keyof typeof iconBg] || iconBg.video;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideIn relative mx-4 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-0 sm:p-8">
          {/* Icon and Title */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className={`w-14 h-14 flex items-center justify-center rounded-full shadow-sm ${iconBgClass} mb-2`}>
              <Icon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 text-center leading-tight mb-1">{content.title}</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {content.contentType.charAt(0).toUpperCase() + content.contentType.slice(1)} Preview
            </span>
          </div>

          {/* Player or Icon Section */}
          <div className="rounded-xl bg-gray-50 p-4 mb-6 flex flex-col items-center">
            {content.contentType === "video" ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black relative">
                <ReactPlayer
                  url={content.contentUrl}
                  width="100%"
                  height="100%"
                  controls={true}
                  playing={true}
                  style={{ position: "absolute", top: 0, left: 0 }}
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
              <div className="flex flex-col items-center justify-center h-48 w-full">
                <div className="mb-4">
                  {content.contentType === "document" ? (
                    <FileText className="h-14 w-14 text-orange-400" />
                  ) : (
                    <LinkIcon className="h-14 w-14 text-green-500" />
                  )}
                </div>
                <a
                  href={content.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-white font-semibold hover:bg-sky-700 transition-colors text-sm shadow"
                >
                  {content.contentType === "document" ? "View Document" : "Open Resource"}
                  <LinkIcon className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="text-center">
            {content.description && (
              <p className="text-gray-700 text-base mb-2 whitespace-pre-line font-medium">{content.description}</p>
            )}
            {content.duration && (
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                Duration: {content.duration} min
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPlayerModal;
