"use client";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCourseContext } from "../context/CourseContext";
import { FeatureCourse, FeatureCourseSkeleton } from "./FetureCourse";

export const FeatureCourseSlider: React.FC = () => {
  const { courses, isLoading, error } = useCourseContext();
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);

  // Update swiper on resize to fix breakpoints/nav
  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.update();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="text-neutral-900 max-md:max-w-full mt-10 relative">
      <h2 className="text-3xl font-bold max-md:max-w-full">Featured courses</h2>
      <p className="mt-3 text-lg max-md:max-w-full">
        Many learners enjoyed this highly rated course for its engaging content.
      </p>

      <div className="mt-10 w-full max-w-[1326px] mx-auto max-md:max-w-full relative group">
        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            if (swiper && swiper.params && swiper.params.navigation) {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Re-init navigation after refs are set
            setTimeout(() => {
              if (swiper?.params?.navigation) {
                // @ts-ignore
                swiper.navigation.destroy();
                // @ts-ignore
                swiper.navigation.init();
                // @ts-ignore
                swiper.navigation.update();
              }
            });
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 1,
            },

            1280: {
              slidesPerView: 2,
            },
          }}
          className="featured-courses-swiper px-2 w-full"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <SwiperSlide key={"skeleton-" + idx} className="!h-auto w-full">
                  <div className="h-full p-2 w-full">
                    <FeatureCourseSkeleton />
                  </div>
                </SwiperSlide>
              ))
            : courses.map((course, index) => {
                const transformedCourse = {
                  ...course,
                  duration: `${course.noOfHours} Hrs`,
                  lessons: course.noOfLessons,
                  price: `${course.isDiscounted && course.discountPrice ? course.discountPrice : course.price}`,
                  originalPrice: `${course.price}`,
                  isNew: course.bestSeller,
                  imageUrl: index % 2 === 1 ? "/img/Course/new-course-2.png" : "/img/Course/new-course.png",
                };
                return (
                  <SwiperSlide key={index} className="!h-auto w-full">
                    <div className="h-full p-2 w-full">
                      <FeatureCourse {...transformedCourse} isNew={true} />
                    </div>
                  </SwiperSlide>
                );
              })}
        </Swiper>

        {/* Navigation Arrows */}
        <button
          ref={prevRef}
          className="featured-swiper-prev absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2.5} />
        </button>
        <button
          ref={nextRef}
          className="featured-swiper-next absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 text-black" strokeWidth={2.5} />
        </button>
      </div>

      <style jsx global>{`
        .featured-courses-swiper {
          width: 100%;
        }
        .swiper-slide {
          height: auto;
        }
        .featured-swiper-prev.swiper-button-disabled,
        .featured-swiper-next.swiper-button-disabled {
          opacity: 0.2 !important;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .featured-swiper-prev,
          .featured-swiper-next {
            opacity: 1 !important;
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};
