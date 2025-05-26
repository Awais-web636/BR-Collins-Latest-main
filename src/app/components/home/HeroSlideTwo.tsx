import React from "react";
import Image from "next/image";

const HeroSlideTwo: React.FC = () => (
  <section className="relative w-full">
    <div className="w-full">
      <Image
        src="/assets/homepagewall2.png"
        width={1920}
        height={1080}
        alt="wallpaper"
        className="w-full h-[300px] lg:h-[500px] object-cover  object-right-top"
        priority
      />
    </div>
    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[linear-gradient(to_right,#F4F6F9,transparent)] md:bg-[linear-gradient(to_right,#F4F6F9,#E9ECF2,_transparent,_transparent)] pointer-events-none flex items-center">
      <div className="w-full p-4 md:p-8 lg:p-0 md:max-w-[1326px] mx-auto">
        <div className="flex flex-col p-4 md:p-4 xl:p-0 justify-start gap-3 md:gap-4 w-full max-w-2xl pointer-events-auto">
          <h2 className="font-hanken  text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-start text-gray-900">
            Your Learning Journey Starts Here
          </h2>
          <p className="text-xl">Get the skills to achieve goals and stay competitive.</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="/subscriptions"
              className="bg-primary hover:bg-primary-hover transition-all duration-200 text-white rounded-full px-4 md:px-5 py-1 md:py-2 font-medium text-sm cursor-pointer"
            >
              Plans for Individual
            </a>
            <a
              href="/subscriptions"
              className="bg-transparent hover:bg-gray-100 transition-all duration-200 text-black border-1 border-gray-600 rounded-full px-4 md:px-5 py-1 md:py-2 font-medium text-sm cursor-pointer"
            >
              Plans for Corporate
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSlideTwo;
