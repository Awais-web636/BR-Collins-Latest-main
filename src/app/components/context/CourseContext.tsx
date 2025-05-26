"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/app/utils/axios";
import { ICourse } from "@/app/types/course.contract";

export interface CourseDetailsType {
  startDate: string;
  enrolled: number;
  lectures: number;
  skillLevel: string;
  language: string;
  quizzes: number;
  certificate: string;
}

export interface LectureType {
  title: string;
  duration: string;
  type: string;
}

export interface SectionType {
  title: string;
  stats: string;
  icon: string;
  lectures: LectureType[];
}

export interface CourseType {
  slug: string;
  duration: string;
  title: string;
  instructor?: string;
  lessons: number;
  rating: number;
  price: string;
  originalPrice?: string;
  isNew?: boolean;
  imageUrl?: string;
  courseDetails: CourseDetailsType;
  description: string;
  learningObjectives: string[];
  requirements: string[];
  sections: SectionType[];
  _id: string;
}

interface CourseContextProps {
  courses: ICourse[];
  isLoading: boolean;
  error: string | null;
}

const CourseContext = createContext<CourseContextProps>({ courses: [], isLoading: true, error: null });

export const useCourseContext = () => useContext(CourseContext);

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses?showBlocked=false");
        const apiCourses = response.data.data;
        const coursesWithRating = apiCourses.map((course: ICourse) => ({
          ...course,
          rating: (course.rating || Math.random() * (5 - 3) + 3).toFixed(1),
          noOfStudents: (course.noOfStudents || Math.floor(Math.random() * (1000 - 1) + 1)).toFixed(0),
        }));

        setCourses(coursesWithRating);
      } catch (err) {
        setError("Failed to fetch courses");
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return <CourseContext.Provider value={{ courses, isLoading, error }}>{children}</CourseContext.Provider>;
};
