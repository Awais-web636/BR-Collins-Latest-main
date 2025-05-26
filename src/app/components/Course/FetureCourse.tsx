"use client";

import React from "react";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa6";

interface CourseCardProps {
  duration: string;
  title: string;
  slug: string;
  instructor?: string;
  lessons: number;
  rating: number;
  price: string;
  originalPrice?: string;
  isNew?: boolean;
  imageUrl?: string;
  _id: string;
  isDiscounted: boolean;
}

export const FeatureCourse: React.FC<CourseCardProps> = ({
  duration,
  title,
  instructor,
  lessons,
  rating,
  price,
  slug,
  originalPrice,
  isNew,
  imageUrl,
  _id,
  isDiscounted,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#F86537] text-base" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#F86537] text-base" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#F86537] text-base" />);
      }
    }
    return stars;
  };

  console.log(isDiscounted, price, originalPrice);

  return (
    <div className="h-[280px] w-full flex items-center gap-6 p-2  bg-white rounded-2xl border border-zinc-200 ">
      {/* Left: Image with 'New' badge */}
      <div className="relative h-full aspect-square flex-shrink-0 rounded-xl overflow-hidden">
        {imageUrl && <img src={imageUrl} alt={title} className="object-cover w-full h-full" />}
        {isNew && (
          <span className="absolute top-5 left-4 bg-[#91F6CA] text-black font-semibold px-3 py-0.5 rounded-md">
            New
          </span>
        )}
      </div>
      {/* Right: Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top row: Duration badge */}
        <div className="flex justify-between items-start w-full">
          <span className="bg-[#2490E0] text-white text-sm font-bold px-2.5 py-1 rounded-md mb-3 uppercase">
            {duration}
          </span>
        </div>
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg sm:text-[22px] font-bold leading-snug text-neutral-900 mb-2 line-clamp-2">{title}</h3>
          {/* Instructor, lessons */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/assets/person.png"
              alt="Instructor avatar"
              className="w-[30px] h-[30px] rounded-full border border-zinc-200 object-cover"
            />
            <span className=" text-neutral-900">
              by:{" "}
              <a href="#" className="text-[#2490E0] font-medium hover:underline">
                {instructor || "Unknown"}
              </a>
            </span>
            <div className="h-4 w-0.5 bg-black/30"></div>
            <span className="flex items-center text-gray-500">
              <img src="/img/Course/lession.svg" className="w-4 h-4 mr-1" alt="Lessons icon" />
              {lessons} Lessons
            </span>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base text-neutral-900 font-semibold">{rating || "4.5"}</span>
            <div className="flex gap-px items-center">{renderStars(rating || 4.5)}</div>
          </div>
        </div>
        {/* Price and CTA */}
        <div className="flex items-center justify-between mt-7">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-neutral-900">
              {parseInt(price.toString()).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
            {isDiscounted && originalPrice && (
              <span className="text-base line-through text-neutral-400">
                {parseInt(originalPrice.toString()).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            )}
          </div>
          <a href={`/course/${_id}`} className="text-base font-semibold text-orange-500 hover:underline ml-2">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export const FeatureCourseSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 px-4 pt-4 pb-4 w-full h-full bg-white rounded-2xl border border-solid border-zinc-200 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] animate-pulse">
      {/* Left side: Image Skeleton */}
      <div className="relative w-full md:w-60 h-62 rounded-xl overflow-hidden bg-gray-200" />

      {/* Right side: Content Skeleton */}
      <div className="flex flex-col flex-1">
        {/* Duration badge skeleton */}
        <span className="mb-2 px-8 py-2 h-6 bg-gray-200 rounded-md w-24" />

        {/* Title & Lessons skeleton */}
        <div className="w-full mt-2">
          <div className="h-7 w-3/4 bg-gray-200 rounded mb-3" />
          <div className="flex gap-1.5 items-center mt-3.5">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>
          <div className="mt-4 w-full h-[1px] bg-gray-200" />
        </div>

        {/* Rating skeleton */}
        <div className="flex gap-1.5 items-center mt-4">
          <div className="h-5 w-8 bg-gray-200 rounded" />
          <div className="flex gap-px items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        {/* Price & CTA skeleton */}
        <div className="mt-6">
          <div className="flex gap-2 items-center">
            <div className="h-7 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>
          <div className="mt-4 h-5 w-28 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
