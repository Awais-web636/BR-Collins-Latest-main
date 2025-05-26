"use client";
import React, { useState } from "react";
import { CourseSection } from "./CourseSection";
import { Check } from "lucide-react";
import { CheckIcon } from "../../../../public/icons/course_details_page_icons";

interface Lecture {
  title: string;
  duration: string;
  type: string;
  allowPreview: boolean;
  contentUrl: string;
  contentType: string;
}

interface Section {
  title: string;
  stats: string;
  totalContents: number;
  totalDuration: number;
  lectures: Lecture[];
}

interface CourseContentProps {
  sections: Section[];
  requirements: string[];
  description: string;
}

export const CourseContent: React.FC<CourseContentProps> = ({ sections: propSections, requirements, description }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    propSections.length > 0 ? { [propSections[0].title]: true } : {}
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    propSections.forEach((section) => {
      allExpanded[section.title] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const allExpanded = Object.keys(expandedSections).length === propSections.length;

  return (
    <>
      <main className="box-border p-4 my-0 w-full  max-sm:p-2.5 max-sm:max-w-screen-sm ml-auto mt-6">
        <section className="mb-10">
          <header className="flex flex-col justify-between mb-5">
            <h1 className="text-3xl font-bold text-neutral-900 max-md:text-3xl max-sm:text-2xl mb-3">Course Content</h1>
            <div className="flex flex-row justify-between items-center">
              <div className="text-base text-neutral-900 max-md:text-sm max-sm:text-xs">
                {propSections.length} sections •{" "}
                {propSections.reduce((acc, section) => acc + section.lectures.length, 0)} lectures •{" "}
                {(() => {
                  const totalMinutes = propSections.reduce((acc, section) => acc + section.totalDuration, 0);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return `${hours > 0 ? `${hours}hr ` : ""}${minutes}min`;
                })()}
              </div>
              {propSections.length > 0 && (
                <button
                  className="text-base font-semibold text-orange-500 underline cursor-pointer max-md:text-sm max-sm:text-xs"
                  onClick={allExpanded ? collapseAll : expandAll}
                >
                  {allExpanded ? "Collapse All Sections" : "Expand All Sections"}
                </button>
              )}
            </div>
          </header>

          {propSections.map((section) => (
            <CourseSection
              key={section.title}
              title={section.title}
              stats={section.stats}
              lectures={section.lectures}
              totalContents={section.totalContents}
              totalDuration={section.totalDuration}
              expanded={expandedSections[section.title]}
              onToggle={() => toggleSection(section.title)}
            />
          ))}
        </section>

        <div className="border-b border-gray-200 my-12"></div>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-bold text-neutral-900 max-md:text-sm max-sm:text-xs">Requirements</h2>
          <ul>
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-center mb-2.5">
                <CheckIcon width={23} height={23} className="mr-2 text-sky-600" strokeWidth={2} />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-b border-gray-200 my-12"></div>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-bold text-neutral-900 max-md:text-sm max-sm:text-xs">Description</h2>
          <p className="text-base leading-7 text-neutral-900 max-md:text-sm max-md:leading-6 max-sm:text-xs max-sm:leading-5">
            {description}
          </p>
        </section>
      </main>
    </>
  );
};

export default CourseContent;
