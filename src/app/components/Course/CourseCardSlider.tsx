"use client";

import React from "react";
import CourseCard from "./CourseCard";
import { ICourse } from "@/app/types/course.contract";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface CourseCardSliderProps {
  courses: ICourse[];
}

const CourseCardSlider: React.FC<CourseCardSliderProps> = ({ courses }) => {
  return (
    <div className="relative w-full ">
      <Swiper
        modules={[Pagination, Mousewheel]}
        spaceBetween={24}
        slidesPerView="auto"
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          type: "bullets",
        }}
        mousewheel={{ forceToAxis: true }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="pb-8"
      >
        {courses.map((course) => (
          <SwiperSlide key={course._id} className="!h-auto  max-w-[220px]">
            <div className="h-full">
              <CourseCard course={course} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination !relative !mt-4 !bottom-0" />
    </div>
  );
};

export default CourseCardSlider;
