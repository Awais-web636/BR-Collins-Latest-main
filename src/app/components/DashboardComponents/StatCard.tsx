import React from "react";
import Image from "next/image";

interface StatCardProps {
  icon: string;
  count: string;
  label: string;
  bgColor: string;
  textColor: string;
}

const StatCard = ({
  icon,
  count,
  label,
  bgColor,
  textColor,
}: StatCardProps) => {
  return (
    <div className="self-stretch my-auto rounded-none min-w-60 w-[289px]">
      <div
        className={`flex flex-col items-start py-5 pr-7 pl-5 ${bgColor} rounded-2xl max-md:pr-5`}
      >
        <Image
          src={icon}
          alt={`${label} icon`}
          className="object-contain rounded-xl aspect-square shadow-[0px_4px_40px_rgba(0,0,0,0.06)] w-[60px]"
        />
        <div className="mt-14 max-md:mt-10">
          <h3 className={`text-6xl font-bold ${textColor} max-md:text-4xl`}>
            {count}
          </h3>
          <p className="mt-2.5 text-lg font-medium text-neutral-900">
            {label}{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
