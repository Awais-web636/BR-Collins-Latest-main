"use client";

import React from "react";
import { FaBook, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Link from "next/link";
import { ICourse } from "@/app/types/course.contract";
import { BookIcon } from "../../../../public/icons/home_page_icons";
import { useRouter } from "next/navigation";
interface CourseCardProps {
  course: ICourse;
  showInPersonButton?: boolean;
  showButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, showInPersonButton = true, showButton = true }) => {
  const router = useRouter();
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#FFB346] text-base" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#FFB346] text-base" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#FFB346] text-base" />);
      }
    }
    return stars;
  };

  const isDiscounted = course.isDiscounted;
  const discountPrice = course.discountPrice ?? course.price;
  const originalPrice = course.price;

  return (
    <div className="h-full min-w-[200px] w-full bg-white rounded-2xl shadow-md transition-all duration-300 border border-gray-200 relative">
      <Link href={`/course/${course._id}`}>
        <div className="p-4 flex flex-col h-full">
          {/* Hours Badge */}
          <div className="mb-4">
            <span className="bg-[#2490E0]  text-white text-xs font-bold px-2.5 py-1 rounded-md">
              {course.noOfHours} HRS
            </span>
          </div>
          {/* Course Title */}
          <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{course.title}</h3>
          {/* Lessons Count */}
          <div className="flex items-center text-gray-600 mb-3">
            <BookIcon className="mr-2 text-gray-400 text-sm" />
            <span className="text-base text-gray-500">{course.noOfLessons} Lessons</span>
          </div>
          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-200 my-3"></div>
          {/* Discount Badge above price */}
          {isDiscounted && (
            <div className="mb-2">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded">
                Save {Math.round(100 - (discountPrice / originalPrice) * 100)}%
              </span>
            </div>
          )}
          <div>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-medium text-gray-700 ml-1">{course.rating || 4.5}</span>
              <div className="flex">{renderStars(course.rating || 4.5)}</div>
            </div>
          </div>
          <div className="mt-auto pt-12">
            {/* Price */}
            <div className="font-bold text-xl text-gray-900 mb-2">
              {isDiscounted ? (
                <div className="flex flex-wrap items-center gap-2 w-full">
                  <span className="text-2xl font-extrabold text-green-600">
                    {parseInt(discountPrice.toString()).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                  <span className="line-through text-gray-400 text-base font-medium">
                    {parseInt(originalPrice.toString()).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-primary text-2xl font-bold">
                  {parseInt(originalPrice.toString()).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              )}
            </div>
            {/* View Details Link */}
            {/* <Link
              href={`/course/${course._id}`}
              className="text-primary text-sm font-medium hover:text-primary-hover transition-colors underline"
            >
              View Details
            </Link> */}
            {/* In Person/Enroll Button */}
            {showButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/course/${course._id}?type=${showInPersonButton ? "in-person" : "e-learning"}`);
                }}
                className="mt-4 w-full mb-2 py-2 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
                type="button"
              >
                {showInPersonButton ? "In Person Training" : "Enroll Now"}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
