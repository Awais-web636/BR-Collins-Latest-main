import React from "react";
import StatCard from "./StatCard";

const StatsSection = () => (
  <div className="w-full lg:w-[50%] h-auto md:h-[410px] flex flex-col justify-between gap-4">
    {/* Top Row */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 h-[48%]">
      <div className="w-full md:w-[48%] h-[180px]">
        <StatCard number="500+" label="Learners & counting" bgColor="bg-rose-50" />
      </div>
      <div className="w-full sm:w-[48%] h-[180px]">
        <StatCard number="800+" label="Courses & Video" bgColor="bg-sky-100" />
      </div>
    </div>
    {/* Bottom Row */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 h-[48%]">
      <div className="w-full sm:w-[48%] h-[180px]">
        <StatCard number="100+" label="Registered Enrolls" bgColor="bg-sky-100" />
      </div>
      <div className="w-full sm:w-[48%] h-[180px]">
        <StatCard number="1000+" label="Certified Students" bgColor="bg-rose-50" />
      </div>
    </div>
  </div>
);

export default StatsSection;
