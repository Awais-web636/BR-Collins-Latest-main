"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/app/utils/axios";

interface Category {
  _id: string;
  name: string;
  description: string;
  isBlocked: boolean;
  createdAt: string;
}

interface CategoryContextProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextProps>({ categories: [], isLoading: true, error: null });

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/course-categories?showBlocked=false");
        const apiCategories = response.data.data;
        setCategories(apiCategories);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return <CategoryContext.Provider value={{ categories, isLoading, error }}>{children}</CategoryContext.Provider>;
};
