import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  iconSrc: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, iconSrc, className = "" }) => (
  <div className={`w-full rounded-none max-md:max-w-full ${className}`}>
    <div className="px-4 md:px-9 py-4 md:py-7 rounded-2xl bg-[#F3F6F8] max-md:max-w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-5">
        <div className="w-full md:w-[17%] max-md:ml-0">
          <img
            src={iconSrc}
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.07] w-16 md:w-[93px]"
            alt={title}
          />
        </div>
        <div className="ml-0 md:ml-5 w-full md:w-[83%]">
          <div className="grow text-neutral-900">
            <h3 className="text-xl md:text-2xl font-bold leading-none max-md:max-w-full">{title}</h3>
            <p className="mt-2 md:mt-3 text-base md:text-lg leading-6 md:leading-7 max-md:max-w-full">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeatureCard;
