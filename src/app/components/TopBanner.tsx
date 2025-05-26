"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";

export const TopBanner = () => {
  const pathname = usePathname();

  // Hide navigation on course learning pages
  if (pathname?.startsWith("/courses/learn/")) {
    return null;
  }
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <header className="flex flex-wrap  justify-between items-center md:h-[50px]  md:px-2 w-full text-base font-medium text-center text-white bg-sky-600">
      <div className="w-6"></div>
      <div className="w-11/12 flex flex-row items-center justify-center">
        <p className="text-sm md:text-base text-center md:text-left w-full md:w-auto">
          Courses from
          <strong className="font-black"> $149.00</strong> Gain the skills to climb that career ladder.{" "}
          <span className="font-bold text-[#FFCA7E]">3 days left!</span>
        </p>
      </div>
      <div className="">
        <button onClick={() => setVisible(false)}>
          <img src="/img/cross.svg" className="w-6 h-6" alt="Close banner" />
        </button>
      </div>
    </header>
  );
};
