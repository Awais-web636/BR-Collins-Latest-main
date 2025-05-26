import React from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCourseContext } from "../context/CourseContext";

import "swiper/css";
import "swiper/css/autoplay";
import HeroSlideOne from "./HeroSlideOne";
import HeroSlideTwo from "./HeroSlideTwo";

interface HeroSectionProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ activeIndex, setActiveIndex }) => {
  const { courses, isLoading } = useCourseContext();
  const firstCourse = courses && courses.length > 0 ? courses[0] : null;

  return (
    <div className="h-[300px] lg:h-[500px] w-full">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
        className="relative"
      >
        <div className="absolute bottom-[5%] right-[10%] flex justify-center items-center gap-2 z-50 h-[10vh]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-b-sm rounded-tl-sm transition-all duration-300 ${
                i === activeIndex ? "bg-primary" : "bg-[#FFFFFF99]"
              }`}
            />
          ))}
        </div>
        <SwiperSlide>
          <HeroSlideOne isLoading={isLoading} firstCourse={firstCourse} />
        </SwiperSlide>
        <SwiperSlide>
          <HeroSlideTwo />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSection;
