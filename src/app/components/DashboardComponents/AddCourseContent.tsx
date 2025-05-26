"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import FormField from "./FormField";
import { ICourse } from "@/app/types/course.contract";
import { CourseContentCreatePayload } from "@/app/types/course-content.contract";
import { useSearchParams, useRouter } from "next/navigation";
import ToggleOption from "./ToggleOption";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, SingleValue } from "react-select";

interface SectionOption {
  value: string;
  label: string;
}

const fetchCourses = async (): Promise<{ data: ICourse[] }> => {
  const response = await api.get("/courses?showBlocked=false");
  return response.data;
};

const fetchSections = async (courseId: string): Promise<{ data: string[] }> => {
  const response = await api.get(`/course-contents/sections/${courseId}`);
  return response.data;
};

const courseContentSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentType: z.enum(["video", "document"]),
  contentUrl: z.string().min(1, "Content URL is required"),
  duration: z.string().min(1, "Duration is required"),
  order: z.number().min(0, "Order must be a non-negative number"),
  isBlocked: z.boolean(),
  allowDownload: z.boolean(),
  allowPreview: z.boolean(),
  sectionName: z.string().min(1, "Section name is required"),
});

export default function AddCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditMode = searchParams.get("edit") === "true";
  const contentId = searchParams.get("contentId");
  const [success, setSuccess] = useState(false);

  const {
    data: courses,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    select: (data) => data.data,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<CourseContentCreatePayload>({
    resolver: zodResolver(courseContentSchema),
    defaultValues: {
      courseId: "",
      title: "",
      description: "",
      contentType: "video",
      contentUrl: "",
      duration: "",
      order: 0,
      isBlocked: false,
      allowDownload: false,
      allowPreview: false,
      sectionName: "",
    },
  });

  const selectedCourseId = watch("courseId");

  const {
    data: sections,
    isLoading: isLoadingSections,
    error: sectionsError,
  } = useQuery({
    queryKey: ["sections", selectedCourseId],
    queryFn: () => fetchSections(selectedCourseId),
    select: (data: { data: string[] }) => data.data,
    enabled: !!selectedCourseId,
  });

  const { data: content } = useQuery({
    queryKey: ["course-content", contentId],
    queryFn: async () => {
      const response = await api.get(`/course-contents/${contentId}`);
      return response.data.data;
    },
    enabled: isEditMode && !!contentId,
  });

  useEffect(() => {
    if (content && isEditMode) {
      setValue("courseId", content.courseId);
      setValue("title", content.title);
      setValue("description", content.description);
      setValue("contentType", content.contentType);
      setValue("contentUrl", content.contentUrl);
      setValue("duration", content.duration);
      setValue("order", content.order);
      setValue("allowDownload", content.allowDownload);
      setValue("allowPreview", content.allowPreview);
      setValue("sectionName", content.sectionName);
    }
  }, [content, isEditMode, setValue]);

  const createCourseContentMutation = useMutation({
    mutationFn: async (data: CourseContentCreatePayload) => {
      const endpoint = isEditMode ? `/course-contents/${contentId}` : "/course-contents";
      const method = isEditMode ? "patch" : "post";
      const response = await api[method](endpoint, data);
      return response.data;
    },
    onSuccess: () => {
      showToast(`Course content ${isEditMode ? "updated" : "added"} successfully`, "success");
      setSuccess(true);
      router.push("/dashboard?item=viewCourseContent");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} course content`;
      showToast(message, "error");
      console.error(`Error ${isEditMode ? "updating" : "adding"} course content:`, error);
    },
  });

  const onSubmit = async (data: CourseContentCreatePayload) => {
    createCourseContentMutation.mutate(data);
  };

  const handleSectionChange = (newValue: SingleValue<SectionOption>, actionMeta: ActionMeta<SectionOption>) => {
    if (actionMeta.action === "create-option") {
      // Handle new section creation
      setValue("sectionName", newValue?.value || "");
    } else {
      setValue("sectionName", newValue?.value || "");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">
        {isEditMode ? "Edit Course Content" : "Add Course Content"}
      </h2>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
          Course content {isEditMode ? "updated" : "added"} successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormField
          label="Course *"
          description="Select the course for this content"
          {...register("courseId")}
          error={errors.courseId?.message}
          select
          required
          options={[
            { value: "", label: isLoadingCourses ? "Loading courses..." : "Select a course" },
            ...(courses?.map((course) => ({
              value: course._id,
              label: course.title,
            })) || []),
          ]}
        />

        {isLoadingCourses && <div className="text-sm text-gray-500">Loading courses...</div>}

        {coursesError && <div className="text-sm text-red-500">Error loading courses. Please try again later.</div>}

        <FormField
          label="Content Title *"
          description="Enter the title for this content"
          placeholder="Content title"
          {...register("title")}
          error={errors.title?.message}
          required
        />

        <FormField
          label="Description *"
          description="Provide a detailed description of the content"
          placeholder="Content description..."
          {...register("description")}
          error={errors.description?.message}
          textarea
          required
        />

        <FormField
          label="Content Type *"
          description="Select the type of content"
          {...register("contentType")}
          error={errors.contentType?.message}
          select
          required
          options={[
            { value: "", label: "Select content type" },
            { value: "video", label: "Video" },
            { value: "document", label: "Document" },
          ]}
        />

        <FormField
          label="Content URL *"
          description="Enter the URL or upload the content"
          placeholder="https://..."
          {...register("contentUrl")}
          error={errors.contentUrl?.message}
          required
        />

        <FormField
          label="Duration (minutes) *"
          description="Enter the duration of the content in minutes"
          placeholder="30"
          {...register("duration")}
          error={errors.duration?.message}
          type="number"
          required
        />

        <FormField
          label="Order *"
          description="Set the order of this content in the course"
          placeholder="1"
          {...register("order", { valueAsNumber: true })}
          error={errors.order?.message}
          type="number"
          required
        />

        <div className="@container mt-6 max-w-full w-[705px]">
          <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
            <div className="grow shrink-0 basis-0 w-full">
              <label className="text-base text-neutral-900">Section Name *</label>
              <p className="mt-1 text-sm text-gray-500">Select or create a section name</p>
            </div>
            <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
              {!selectedCourseId ? (
                <div className="text-sm text-gray-500">Please select a course first</div>
              ) : isLoadingSections ? (
                <div className="text-sm text-gray-500">Loading sections...</div>
              ) : sectionsError ? (
                <div className="text-sm text-red-500">Error loading sections. Please try again later.</div>
              ) : (
                <Controller
                  name="sectionName"
                  control={control}
                  render={({ field }) => (
                    <CreatableSelect<SectionOption>
                      {...field}
                      value={field.value ? { value: field.value, label: field.value } : null}
                      isClearable
                      isSearchable
                      options={sections?.map((section) => ({ value: section, label: section })) || []}
                      placeholder="Select or create a section"
                      className="w-full"
                      classNamePrefix="select"
                      onChange={handleSectionChange}
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "44px",
                          borderRadius: "0.5rem",
                          borderColor: "#e5e7eb",
                          backgroundColor: "#f1f5f9",
                          "&:hover": {
                            borderColor: "#d1d5db",
                          },
                        }),
                        input: (base) => ({
                          ...base,
                          color: "#111827",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#111827",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9ca3af",
                        }),
                        option: (base, state) => ({
                          ...base,
                          color: "#111827",
                          backgroundColor: state.isSelected ? "#f1f5f9" : "white",
                          "&:hover": {
                            backgroundColor: "#f1f5f9",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }),
                        menuList: (base) => ({
                          ...base,
                          padding: "0.5rem",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#6b7280",
                          "&:hover": {
                            color: "#4b5563",
                          },
                        }),
                        clearIndicator: (base) => ({
                          ...base,
                          color: "#6b7280",
                          "&:hover": {
                            color: "#4b5563",
                          },
                        }),
                      }}
                    />
                  )}
                />
              )}
              {errors.sectionName && <p className="mt-1 text-sm text-red-500">{errors.sectionName.message}</p>}
            </div>
          </div>
        </div>

        <div className="@container mt-6 max-w-full w-[705px]">
          <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
            <div className="grow shrink-0 basis-0 w-full">
              <label className="text-base text-neutral-900">Content Settings</label>
              <p className="mt-1 text-sm text-gray-500">Configure content access settings</p>
            </div>
            <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
              <div className="space-y-4">
                {/* <Controller
                  name="allowDownload"
                  control={control}
                  render={({ field }) => (
                    <ToggleOption
                      label="Allow Download"
                      description="Allow users to download this content"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                /> */}
                <Controller
                  name="allowPreview"
                  control={control}
                  render={({ field }) => (
                    <ToggleOption
                      label="Allow Preview"
                      description="Allow users to preview this content"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={createCourseContentMutation.isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {createCourseContentMutation.isPending ? "Submitting..." : isEditMode ? "Update Content" : "Add Content"}
          </button>
        </div>
      </form>
    </div>
  );
}
