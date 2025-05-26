import React from "react";
import Link from "next/link";
import StatsSection from "./StatsSection";

const CommunitySection = () => (
  <section className="mx-auto flex flex-col items-center text-gray-900 w-full max-w-[1326px] lg:h-[410px] px-1  md:px-2 ">
    <div className="flex flex-col lg:flex-row justify-between items-center h-full w-full gap-4 px-5  ">
      {/* Left Content Section */}
      <div className="flex flex-col justify-between w-full lg:w-[50%] text-center md:text-left">
        <div className="flex flex-col h-full gap-4 max-lg:pt-10 md:gap-4">
          <span className="text-lg text-orange-500 uppercase font-bold">WHY CHOOSE US</span>
          <h2 className="text-3xl md:text-[50px] leading-[40px] md:leading-[60px] text-neutral-900 font-bold">
            Creating A Community Of Life Long Learners
          </h2>
          <p className="text-lg mt-1 md:text-[22px] leading-7 md:leading-8 text-neutral-900">
            At B.R Collins, our on-site training transforms everyday lessons into engaging and interactive experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
            <Link
              href="/course"
              className="px-7 py-3 md:px-8 text-white bg-primary rounded-full hover:bg-primary-hover transition-colors text-center"
            >
              Explore Courses
            </Link>
            <Link
              href="/about"
              className="px-7 py-3 md:px-8 border border-neutral-900 rounded-full hover:bg-gray-100 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <StatsSection />
    </div>
  </section>
);

export default CommunitySection;
