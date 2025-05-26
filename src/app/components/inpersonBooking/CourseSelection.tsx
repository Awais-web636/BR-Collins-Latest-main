import * as React from "react";

interface CourseSelectionProps {
  onSelect: (duration: "half-day" | "full-day") => void;
  selectedDuration: "half-day" | "full-day";
}

export const CourseSelection: React.FC<CourseSelectionProps> = ({ onSelect, selectedDuration }) => {
  const courseOptions = [
    {
      label: "Half-Day Course",
      value: "half-day",
      price: "$1495",
    },
    {
      label: "Full-Day Course",
      value: "full-day",
      price: "$1995",
    },
  ];

  return (
    <div className="flex flex-col mt-14 max-w-full text-neutral-900  max-md:mt-10">
      <div className="flex gap-5  max-md:flex-col w-full">
        <h2 className="text-2xl font-bold w-[280px] shrink-0">Choose Course Duration:</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 md:gap-2  md:flex-col justify-start text-lg flex-grow">
          {courseOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="courseDuration"
                checked={selectedDuration === option.value}
                onChange={() => onSelect(option.value as "half-day" | "full-day")}
                className="w-5 h-5 text-sky-500 border-gray-300 focus:ring-sky-500 cursor-pointer"
              />
              <div className="flex gap-2.5 items-center">
                <span>{option.label}:</span>
                <span className="font-bold">{option.price}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
