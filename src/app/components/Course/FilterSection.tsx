"use client";
import React, { useState } from "react";
import { useCategoryContext } from "../context/CategoryContext";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
}

interface CheckboxItemProps {
  label?: string;
  children?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, children }) => {
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-lg font-semibold text-neutral-900 max-md:text-lg max-sm:text-base">{title}</h3>
      {children}
    </section>
  );
};

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, children, checked, onChange }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer">
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div
        className={`w-6 h-6 rounded-md border-2 border-solid ${
          checked ? "bg-sky-500 border-sky-500" : "bg-white border-zinc-200"
        }`}
      >
        {checked && (
          <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && <span className="text-base text-neutral-900 max-md:text-base max-sm:text-sm">{label}</span>}
      {children}
    </label>
  );
};

const ShowMoreButton: React.FC<{
  isExpanded: boolean;
  onToggle: () => void;
  hasMore: boolean;
}> = ({ isExpanded, onToggle, hasMore }) => {
  if (!hasMore) return null;

  return (
    <button onClick={onToggle} className="text-base font-semibold text-sky-500 underline cursor-pointer">
      {isExpanded ? "Show less" : "Show more"}
    </button>
  );
};

interface FilterSectionProps {
  topicFilters: {
    [key: string]: boolean;
  };
  languageFilters: {
    [key: string]: boolean;
  };
  durationFilters: {
    [key: string]: boolean;
  };
  ratingFilters: {
    [key: string]: boolean;
  };
  onTopicFilterChange: (topic: string, checked: boolean) => void;
  onLanguageFilterChange: (language: string, checked: boolean) => void;
  onDurationFilterChange: (duration: string, checked: boolean) => void;
  onRatingFilterChange: (rating: string, checked: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  topicFilters,
  languageFilters,
  durationFilters,
  ratingFilters,
  onTopicFilterChange,
  onLanguageFilterChange,
  onDurationFilterChange,
  onRatingFilterChange,
}) => {
  const { categories, isLoading, error } = useCategoryContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDurationExpanded, setIsDurationExpanded] = useState(false);
  const INITIAL_CATEGORIES_TO_SHOW = 3;
  const INITIAL_DURATIONS_TO_SHOW = 3;

  const hasMoreCategories = (categories?.length || 0) > INITIAL_CATEGORIES_TO_SHOW;
  const visibleCategories =
    categories?.length > 0 ? (isExpanded ? categories : categories.slice(0, INITIAL_CATEGORIES_TO_SHOW)) : [];

  const durationOptions = [
    { label: "0-1 Hours", value: "0-1 Hours" },
    { label: "1-3 Hours", value: "1-3 Hours" },
    { label: "3-6 Hours", value: "3-6 Hours" },
    { label: "6-12 Hours", value: "6-12 Hours" },
    { label: "12-24 Hours", value: "12-24 Hours" },
    { label: "24+ Hours", value: "24+ Hours" },
  ];

  const hasMoreDurations = durationOptions.length > INITIAL_DURATIONS_TO_SHOW;
  const visibleDurations = isDurationExpanded ? durationOptions : durationOptions.slice(0, INITIAL_DURATIONS_TO_SHOW);

  const ratingOptions = [
    { label: "4.5 & up", value: "4.5" },
    { label: "4.0 & up", value: "4.0" },
    { label: "3.5 & up", value: "3.5" },
    { label: "3.0 & up", value: "3.0" },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#FFB346] text-base" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#FFB346] text-base" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#FFB346] text-base" />);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <aside className="flex flex-col p-0 mx-auto max-w-none bg-white w-[385px] max-md:px-4 max-md:py-0 max-md:w-full max-md:max-w-[991px] max-sm:px-3 max-sm:py-0 max-sm:max-w-screen-sm">
        <div className="flex flex-col gap-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="flex flex-col p-0 mx-auto max-w-none bg-white w-[385px] max-md:px-4 max-md:py-0 max-md:w-full max-md:max-w-[991px] max-sm:px-3 max-sm:py-0 max-sm:max-w-screen-sm">
        <div className="text-red-500">{error}</div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col p-0 mx-auto max-w-none bg-white w-[385px] max-md:px-4 max-md:py-0 max-md:w-full max-md:max-w-[991px] max-sm:px-3 max-sm:py-0 max-sm:max-w-screen-sm">
      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-bold text-neutral-900 max-md:text-lg max-sm:text-base">Filter By</h2>
        <div className="w-full h-px bg-[#D9E2E6]" />
        <FilterGroup title="Topic Categories">
          <div className="flex flex-col gap-3">
            {visibleCategories.map((category) => (
              <CheckboxItem
                key={category._id}
                label={category.name}
                checked={topicFilters[category._id] || false}
                onChange={(checked) => onTopicFilterChange(category._id, checked)}
              />
            ))}
          </div>
          <ShowMoreButton
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            hasMore={hasMoreCategories}
          />
        </FilterGroup>

        <div className="w-full h-px bg-[#D9E2E6]" />

        <FilterGroup title="By Rating">
          <div className="flex flex-col gap-3">
            {ratingOptions.map((rating) => (
              <CheckboxItem
                key={rating.value}
                checked={ratingFilters[rating.value] || false}
                onChange={(checked) => onRatingFilterChange(rating.value, checked)}
              >
                <span className="flex items-center gap-1">
                  {renderStars(Number(rating.value))}
                  <span className="ml-2 text-base text-neutral-900 max-md:text-base max-sm:text-sm">
                    {rating.label}
                  </span>
                </span>
              </CheckboxItem>
            ))}
          </div>
        </FilterGroup>

        <div className="w-full h-px bg-[#D9E2E6]" />

        <FilterGroup title="By Language">
          <div className="flex flex-col gap-3">
            <CheckboxItem
              label="English"
              checked={languageFilters["English"] || false}
              onChange={(checked) => onLanguageFilterChange("English", checked)}
            />
            <CheckboxItem
              label="Arabic"
              checked={languageFilters["Arabic"] || false}
              onChange={(checked) => onLanguageFilterChange("Arabic", checked)}
            />
          </div>
        </FilterGroup>

        <div className="w-full h-px bg-[#D9E2E6]" />

        <FilterGroup title="By Video Duration">
          <div className="flex flex-col gap-3">
            {visibleDurations.map((duration) => (
              <CheckboxItem
                key={duration.value}
                label={duration.label}
                checked={durationFilters[duration.value] || false}
                onChange={(checked) => onDurationFilterChange(duration.value, checked)}
              />
            ))}
          </div>
          <ShowMoreButton
            isExpanded={isDurationExpanded}
            onToggle={() => setIsDurationExpanded(!isDurationExpanded)}
            hasMore={hasMoreDurations}
          />
        </FilterGroup>
      </div>
    </aside>
  );
};

export default FilterSection;
