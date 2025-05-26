"use client";

import { ICourse } from "@/app/types/course.contract";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { CategoryProvider } from "../context/CategoryContext";
import { useCourseContext } from "../context/CourseContext";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "./CourseCardSkeleton";
import CourseSwiper from "./CourseSwiper";
import { FeatureCourseSlider } from "./FeatureCourseSlider";
import FilterSection from "./FilterSection";
import { HeroSection } from "./HeroSection";
import Pagination from "../common/Pagination";

export default function Courses() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const { courses: allCourses, isLoading, error } = useCourseContext();

  const [topicFilters, setTopicFilters] = React.useState<{ [key: string]: boolean }>(() => {
    if (initialCategory) {
      return { [initialCategory]: true };
    }
    return {};
  });
  const [languageFilters, setLanguageFilters] = React.useState<{ [key: string]: boolean }>({});
  const [durationFilters, setDurationFilters] = React.useState<{ [key: string]: boolean }>({});
  const [ratingFilters, setRatingFilters] = React.useState<{ [key: string]: boolean }>({});

  // Tab switching logic (copied from homepage)
  const [activeTab, setActiveTab] = React.useState<string>("in-person");
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const eLearningRef = React.useRef<HTMLButtonElement>(null);
  const inPersonRef = React.useRef<HTMLButtonElement>(null);
  const [sliderStyle, setSliderStyle] = React.useState({ left: 0, width: 0 });

  // Filter courses based on selected filters
  const filteredCourses = React.useMemo(() => {
    if (!allCourses) return [];

    return allCourses.filter((course) => {
      // Check if any filters are active
      const hasActiveTopicFilters = Object.values(topicFilters).some((value) => value);
      const hasActiveLanguageFilters = Object.values(languageFilters).some((value) => value);
      const hasActiveDurationFilters = Object.values(durationFilters).some((value) => value);
      const hasActiveRatingFilters = Object.values(ratingFilters).some((value) => value);

      // If no filters are active, show all courses
      if (!hasActiveTopicFilters && !hasActiveLanguageFilters && !hasActiveDurationFilters && !hasActiveRatingFilters) {
        return true;
      }

      // Topic filter check
      if (hasActiveTopicFilters) {
        const courseTopic = course.categoryId;
        if (!topicFilters[courseTopic]) {
          return false;
        }
      }

      // Language filter check
      if (hasActiveLanguageFilters) {
        const courseLanguage = course.language;
        if (!languageFilters[courseLanguage]) {
          return false;
        }
      }

      // Duration filter check
      if (hasActiveDurationFilters) {
        const courseDuration = course.noOfHours;
        let durationRange = "";

        if (courseDuration <= 1) {
          durationRange = "0-1 Hours";
        } else if (courseDuration <= 3) {
          durationRange = "1-3 Hours";
        } else if (courseDuration <= 6) {
          durationRange = "3-6 Hours";
        } else if (courseDuration <= 12) {
          durationRange = "6-12 Hours";
        } else if (courseDuration <= 24) {
          durationRange = "12-24 Hours";
        } else {
          durationRange = "24+ Hours";
        }

        // Check if the course's duration range is selected
        if (!durationFilters[durationRange]) {
          return false;
        }
      }

      // Rating filter check
      if (hasActiveRatingFilters) {
        // Assume course.rating is a number (e.g., 4.7)
        const courseRating = course.rating || (Math.random() * 5).toFixed(1);
        // Find the lowest selected rating
        const selectedRatings = Object.keys(ratingFilters)
          .filter((key) => ratingFilters[key])
          .map(Number);

        if (selectedRatings.length > 0) {
          // If course rating is less than the minimum selected, filter out
          // But since these are "& up", we want to show if it matches ANY selected
          const matches = selectedRatings.some((minRating) => Number(courseRating.toString()) >= minRating);
          if (!matches) return false;
        }
      }

      return true;
    });
  }, [allCourses, topicFilters, languageFilters, durationFilters, ratingFilters]);

  // Pagination logic (moved below filteredCourses)
  const [currentPage, setCurrentPage] = React.useState(1);
  const COURSES_PER_PAGE = 12;
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const paginatedCourses = React.useMemo(() => {
    const startIdx = (currentPage - 1) * COURSES_PER_PAGE;
    return filteredCourses.slice(startIdx, startIdx + COURSES_PER_PAGE);
  }, [filteredCourses, currentPage]);

  React.useLayoutEffect(() => {
    const activeBtn = activeTab === "e-learning" ? eLearningRef.current : inPersonRef.current;
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setSliderStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const handleTopicFilterChange = (topic: string, checked: boolean) => {
    setTopicFilters((prev) => ({
      ...prev,
      [topic]: checked,
    }));
  };

  const handleLanguageFilterChange = (language: string, checked: boolean) => {
    setLanguageFilters((prev) => ({
      ...prev,
      [language]: checked,
    }));
  };

  const handleDurationFilterChange = (duration: string, checked: boolean) => {
    setDurationFilters((prev) => ({
      ...prev,
      [duration]: checked,
    }));
  };

  const handleRatingFilterChange = (rating: string, checked: boolean) => {
    setRatingFilters((prev) => ({
      ...prev,
      [rating]: checked,
    }));
  };

  React.useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [topicFilters, languageFilters, durationFilters, ratingFilters]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#courses-section") {
      const el = document.getElementById("courses-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <CategoryProvider>
      <main className="flex overflow-hidden flex-col bg-white">
        <HeroSection />

        <section className="bg-gradient-to-b from-[#FFFFFF] to-[#F2F9FF] flex justify-center">
          <div className="flex flex-col self-center  w-full max-w-[1326px] max-md:mt-10 max-md:max-w-full pl-2 p-2  ">
            <div className="flex flex-col items-start mr-0 w-full max-md:max-w-full p-2">
              <FeatureCourseSlider />
              <section className="mt-20 text-neutral-900 max-md:mt-10 max-md:max-w-full">
                <h2 className="text-3xl font-bold max-md:max-w-full">Most Popular Courses</h2>
                <p className="mt-3 text-lg max-md:max-w-full">Explore courses from experienced, real-world experts.</p>
              </section>
              {/* Tab Switcher */}
              <div className="relative flex flex-wrap gap-8 items-center mt-14 text-xl whitespace-nowrap max-md:mt-10">
                {/* Sliding border */}
                <span
                  className="absolute bottom-0 h-1 bg-orange-500 rounded transition-all duration-300"
                  style={{ left: sliderStyle.left, width: sliderStyle.width }}
                />

                <button
                  ref={inPersonRef}
                  onClick={() => setActiveTab("in-person")}
                  className={`pb-2 px-1 transition-all duration-300 z-10 ${
                    activeTab === "in-person" ? "text-gray-800 font-bold" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  In-Person
                </button>
                <button
                  ref={eLearningRef}
                  onClick={() => setActiveTab("e-learning")}
                  className={`pb-2 px-1 transition-all duration-300 z-10 ${
                    activeTab === "e-learning" ? "text-gray-800 font-bold" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  E-Learning
                </button>
              </div>
              <hr className="border-gray-200 w-full" />
              <CourseSwiper activeTab={activeTab} />
            </div>
          </div>
        </section>

        <section
          id="courses-section"
          className="flex flex-col self-center mt-20 w-full max-w-[1326px] max-md:mt-10 max-md:max-w-full pl-2 p-2"
        >
          <h2 className="self-start text-3xl font-bold text-center text-neutral-900 max-md:max-w-full p-5">
            All Courses
          </h2>

          <div className="mt-16 max-md:mt-10 max-md:max-w-full p-5">
            <div className="flex gap-5 max-md:flex-col">
              <aside className="w-[31%] max-md:w-full">
                <FilterSection
                  topicFilters={topicFilters}
                  languageFilters={languageFilters}
                  durationFilters={durationFilters}
                  ratingFilters={ratingFilters}
                  onTopicFilterChange={handleTopicFilterChange}
                  onLanguageFilterChange={handleLanguageFilterChange}
                  onDurationFilterChange={handleDurationFilterChange}
                  onRatingFilterChange={handleRatingFilterChange}
                />
              </aside>

              <main className="ml-5 w-[69%] max-md:ml-0 max-md:w-full">
                {/* Conditional rendering for loading, error, or courses */}
                {isLoading ? (
                  <CardsGridSkeleton />
                ) : error ? (
                  <CardsGridError error={error} />
                ) : filteredCourses.length === 0 ? (
                  <NoCoursesFound
                    resetFilters={() => {
                      setTopicFilters({});
                      setLanguageFilters({});
                      setDurationFilters({});
                      setRatingFilters({});
                    }}
                  />
                ) : (
                  <>
                    <CardsGrid filteredCourses={paginatedCourses} />
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                      </div>
                    )}
                  </>
                )}
              </main>
            </div>
          </div>
        </section>
      </main>
    </CategoryProvider>
  );
}

const CardsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="h-full">
          <CourseCardSkeleton />
        </div>
      ))}
    </div>
  );
};

const CardsGridError = ({ error }: { error: string }) => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-red-500 text-lg">{error}</div>
    </div>
  );
};

const NoCoursesFound = ({ resetFilters }: { resetFilters: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 mb-6">
        <svg className="w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
      <p className="text-gray-500 max-w-md">
        We couldn't find any courses matching your filters. Try adjusting your search criteria or clear the filters to
        see all available courses.
      </p>
      <button
        onClick={resetFilters}
        className="mt-6 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

const CardsGrid = ({ filteredCourses }: { filteredCourses: ICourse[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {filteredCourses.map((course, index) => {
        return (
          <div key={index} className="h-full">
            <CourseCard course={course} showButton={false} />
          </div>
        );
      })}
    </div>
  );
};
