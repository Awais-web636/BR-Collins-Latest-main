"use client";
import { useRef, useState, useLayoutEffect } from "react";

import SubscriptionCards from "../components/pricing/SubscriptionCards";
// import CourseSwiper from "../components/Course/CourseSwiper";

import "swiper/css";
import "swiper/css/autoplay";
import CourseSwiper from "../components/Course/CourseSwiper";
import CommunitySection from "../components/home/CommunitySection";
import CourseCategories from "../components/home/CourseCategories";
import HeroSection from "../components/home/HeroSection";
import OnSiteLearningSection from "../components/home/OnSiteLearningSection";
import TestimonialsSection from "../components/home/TestimonialsSection";

export const Homepage = () => {
  const [activeTab, setActiveTab] = useState<string>("in-person");
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const eLearningRef = useRef<HTMLButtonElement>(null);
  const inPersonRef = useRef<HTMLButtonElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const activeBtn = activeTab === "e-learning" ? eLearningRef.current : inPersonRef.current;
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setSliderStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <>
      {/* Hero Section */}
      <HeroSection activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      {/* Courses Section */}
      <section className="w-full p-4 md:p-4 xl:py-10 max-w-[1326px] mx-auto py-8 md:py-12">
        <section className="relative text-gray-900 w-full">
          <div className="w-full">
            <div className="flex flex-col w-full">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-start text-gray-800">
                Your Complete Skill Set Starts Here
              </h2>

              <div className="relative flex flex-wrap gap-4 sm:gap-6 mt-3">
                {/* Sliding border */}
                <span
                  className="absolute bottom-0 h-1 bg-primary rounded transition-all duration-300"
                  style={{ left: sliderStyle.left, width: sliderStyle.width }}
                />

                <button
                  ref={inPersonRef}
                  onClick={() => setActiveTab("in-person")}
                  className={`pb-2 px-1 transition-all duration-300 ${activeTab === "in-person" ? "text-gray-800 font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  In-Person
                </button>
                <button
                  ref={eLearningRef}
                  onClick={() => setActiveTab("e-learning")}
                  className={`pb-2 px-1 transition-all duration-300 ${activeTab === "e-learning" ? "text-gray-800 font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  E-Learning
                </button>
              </div>

              <hr className="border-gray-200" />
            </div>
          </div>
        </section>

        {/* Slider Section */}

        <CourseCategories />

        <CourseSwiper activeTab={activeTab} />
      </section>

      <div className="w-full px-4 h-auto items-center justify-around p-4 md:p-4 xl:p-0 lg:px-4 mx-auto flex flex-col max-w-[1326px] md:h-auto  py-12">
        {/* On Site Learning Section */}
        <OnSiteLearningSection />
        {/* Community Section */}
      </div>

      {/* Pricing Section */}
      <section className="bg-[#081B25]  px-1 py-20 md:px-0">
        <div className="w-full p-4 md:p-4 xl:p-0 flex flex-col justify-center gap-5 h-full py-10 items-center mx-auto max-w-[1326px]">
          <div className="flex flex-col justify-center items-center text-center mb-6">
            <h2 className="text-white font-hanken text-2xl md:text-[34px] font-bold">
              Flexible Pricing for Individuals and Teams
            </h2>
          </div>
          <SubscriptionCards />
        </div>
      </section>

      {/* Testimonials Section */}

      <TestimonialsSection />
      <div className="w-full px-4 h-auto items-center justify-around p-4 md:p-4 xl:p-0 lg:px-4 mx-auto flex flex-col max-w-[1326px] md:h-auto lg:h-[750px] py-12">
        {/* Community Section */}
        <CommunitySection />
      </div>
    </>
  );
};
