import React from "react";

const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="h-full min-w-[200px] w-full bg-white rounded-2xl shadow-md transition-all duration-300 border border-gray-200">
      <div className="p-4 flex flex-col h-full animate-pulse">
        {/* Hours Badge */}
        <div className="mb-4">
          <span className="inline-block bg-blue-200 text-blue-200 text-xs font-bold px-2.5 py-1 rounded-md w-16 h-5" />
        </div>

        {/* Course Title */}
        <div className="font-bold text-xl text-gray-900 mb-2 leading-tight h-6 w-3/4 bg-gray-200 rounded" />

        {/* Lessons Count */}
        <div className="flex items-center text-gray-600 mb-3">
          <div className="mr-2 w-4 h-4 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200 my-3" />
        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-8 bg-gray-200 rounded ml-1" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto pt-12">
          {/* Price */}
          <div className="font-bold text-xl text-gray-900 mb-2 h-6 w-20 bg-gray-200 rounded" />

          {/* View Details Link */}
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
