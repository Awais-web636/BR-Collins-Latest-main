"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import FormField from "./FormField";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/app/utils/toast";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function AddCourseCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const categoryId = searchParams.get("categoryId");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const { data: categoryData } = useQuery({
    queryKey: ["course-category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      const response = await api.get(`/course-categories/${categoryId}`);
      return response.data.data;
    },
    enabled: !!categoryId,
  });

  useEffect(() => {
    if (categoryData) {
      setValue("name", categoryData.name);
      setValue("description", categoryData.description);
    }
  }, [categoryData, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      if (isEditMode && categoryId) {
        return api.put(`/course-categories/${categoryId}`, data);
      }
      return api.post("/course-categories", data);
    },
    onSuccess: () => {
      showToast("Category updated successfully", "success");
      router.push("/dashboard?item=viewCourseCategory");
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || "Something went wrong", "error");
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">
        {isEditMode ? "Edit Course Category" : "Add New Course Category"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormField
          label="Name *"
          description="Enter the name of the course category"
          placeholder="e.g., Web Development"
          error={errors.name?.message}
          required
          {...register("name")}
        />

        <FormField
          label="Description *"
          description="Enter a description for the course category"
          placeholder="e.g., Courses related to web development technologies"
          error={errors.description?.message}
          required
          textarea
          {...register("description")}
        />

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : isEditMode ? "Update Category" : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
