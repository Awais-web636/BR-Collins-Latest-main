"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

import { useCourseContext } from "../context/CourseContext";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "./CourseCardSkeleton";
import { ICourse } from "@/app/types/course.contract";

interface Course {
  id: string;
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  isNew: boolean;
  noOfHours: number;
  noOfLessons: number;
  discountPrice?: number;
  price: number;
  bestSeller: boolean;
  coverImageUrl?: string;
  isDiscounted: boolean;
}

interface CourseSwiperProps {
  excludeCourseId?: string; // Optional prop
  title?: string; // Optional custom title
  activeTab?: string;
}

const CourseSwiper: React.FC<CourseSwiperProps> = ({ excludeCourseId, title = "See More Courses", activeTab }) => {
  const { courses: allCourses, isLoading } = useCourseContext();

  // Filter courses if excludeCourseId is provided
  const displayedCourses = excludeCourseId
    ? allCourses?.filter((course) => course._id !== excludeCourseId && course.id !== excludeCourseId)
    : allCourses;

  let filteredCourses: ICourse[] = [];
  if (activeTab === "all" || !activeTab) {
    filteredCourses = displayedCourses;
  } else if (activeTab === "e-learning") {
    filteredCourses = displayedCourses?.filter((course) => course.onlineLearning);
  } else if (activeTab === "in-person") {
    filteredCourses = displayedCourses?.filter((course) => course.inPersonLearning);
  }

  if (isLoading) {
    return (
      <div className="mt-10 mx-auto max-w-[1326px] px-1">
        <Swiper
          spaceBetween={32}
          modules={[Scrollbar]}
          scrollbar={{
            draggable: true,
            hide: false,
            dragSize: 64,
            snapOnRelease: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 14 },
            640: { slidesPerView: 3, spaceBetween: 14 },
            1124: { slidesPerView: 4, spaceBetween: 14 },
            1224: { slidesPerView: 5, spaceBetween: 14 },
            1274: { slidesPerView: 6, spaceBetween: 14 },
          }}
          className="custom-swiper"
        >
          {[...Array(6)].map((_, idx) => (
            <SwiperSlide
              key={idx}
              className="!w-[calc(100%/1.1)] sm:!w-[calc(100%/3.2)] lg:!w-[calc(100%/5.4)] xl:!w-[calc(100%/6.4)]"
            >
              <div className="h-full p-2">
                <CourseCardSkeleton />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (!filteredCourses || filteredCourses.length === 0) {
    return <p className="mt-10 text-gray-500">No courses available.</p>;
  }

  return (
    <div className="mt-10 mx-auto max-w-[1326px] px-1">
      {" "}
      {/* Added container constraints */}
      <Swiper
        spaceBetween={32}
        modules={[Scrollbar]}
        scrollbar={{
          draggable: true,
          hide: false,
          dragSize: 64,
          snapOnRelease: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 14,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
          1124: {
            slidesPerView: 4,
            spaceBetween: 14,
          },
          1224: {
            slidesPerView: 5,
            spaceBetween: 14,
          },
          1274: {
            slidesPerView: 6,
            spaceBetween: 14,
          },
        }}
        className="custom-swiper"
      >
        {filteredCourses.map((course, index) => {
          return (
            <SwiperSlide
              key={index}
              className="!w-[calc(100%/1.1)] sm:!w-[calc(100%/3.2)] lg:!w-[calc(100%/5.4)] xl:!w-[calc(100%/6.4)]"
            >
              <div className="h-full p-2">
                <CourseCard course={course} showInPersonButton={activeTab === "in-person"} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <style jsx global>{`
        .custom-swiper {
          padding-bottom: 55px;
          width: 100%;
          overflow: hidden;
        }

        .custom-swiper .swiper-scrollbar {
          max-width: 315px;
          height: 3px;
          background: rgba(0, 0, 0, 0.1);
          left: 50%;
          transform: translateX(-50%);

          bottom: 8px;
        }

        .custom-swiper .swiper-scrollbar-drag {
          background: #2490e0;
          height: 3px;
          cursor: pointer;
        }

        .custom-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default CourseSwiper;
