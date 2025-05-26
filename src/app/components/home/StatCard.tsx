import React from "react";

interface StatCardProps {
  number: string;
  label: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, bgColor }) => (
  <div className={`rounded-2xl p-4 md:p-6 ${bgColor} h-full flex flex-col items-center justify-center`}>
    <h3 className="text-3xl md:text-[50px] font-medium text-neutral-900">{number}</h3>
    <p className="text-sm md:text-lg text-neutral-700 mt-1 md:mt-2">{label}</p>
  </div>
);

export default StatCard;
