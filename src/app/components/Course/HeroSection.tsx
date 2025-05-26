"use client";

import Link from "next/link";
import React from "react";

export const HeroSection = () => {
  return (
    <section className="flex flex-col items-center px-4 pt-5 w-full bg-sky-50 max-md:px-4 max-md:max-w-full ">
      <div className="w-full max-w-[1326px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-6/12 max-md:w-full">
            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
              <nav className="flex gap-1 items-end self-start text-base text-teal-950">
                <Link href="/">Home</Link>
                <img
                  src="/img/Hero/arrow.svg"
                  className="object-contain shrink-0 aspect-square w-[18px]"
                  alt="Breadcrumb separator"
                />
                <Link href="/course" className="font-semibold text-sky-500">
                  Courses
                </Link>
              </nav>
              <div className="mt-20 text-neutral-900 max-md:mt-10 max-md:max-w-full">
                <h1 className="text-5xl font-bold leading-[60px] max-md:max-w-full max-md:text-4xl max-md:leading-[51px]">
                  Explore Our Courses
                </h1>
                <p className="mt-5 text-xl max-md:max-w-full">Browse a variety of courses to boost your skills.</p>
              </div>
            </div>
          </div>
          <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <img
              src="/img/Hero/hero1.png"
              className="object-contain grow w-full aspect-[1.76] max-md:mt-10 max-md:max-w-full"
              alt="Hero illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
