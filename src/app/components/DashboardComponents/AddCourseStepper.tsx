"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CourseCreatePayload } from "@/app/types/course.contract";
import FormField from "./FormField";
import ToggleOption from "./ToggleOption";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { ICourse } from "@/app/types/course.contract";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type FieldArrayValue = {
  value: string;
};

type CourseFormData = {
  title: string;
  subtitle?: string;
  slug: string;
  startDate: Date;
  language: string;
  bestSeller: boolean;
  price: number;
  discountPrice?: number;
  isDiscounted: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  previewVideoUrl?: string;
  coverImageUrl?: string;
  whatYouWillLearn: FieldArrayValue[];
  requirements: FieldArrayValue[];
  overview: string;
  description: string;
  instructor: string;
  skillLevel: string;
  noOfQuizzes: number;
  hasCertificate: boolean;
  passPercentage: number;
  categoryId: string;
  onlineLearning: boolean;
  inPersonLearning: boolean;
};

const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required and must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  subtitle: z.string().max(200, "Subtitle must be less than 200 characters").optional(),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters"),
  startDate: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof String) {
        // If empty string, treat as undefined
        if (val === "") return undefined;
        return new Date(val as string);
      }
      return val;
    },
    z
      .date({ required_error: "Start date is required", invalid_type_error: "Invalid date" })
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Start date is required",
      })
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {
          message: "Start date cannot be earlier than today",
        }
      )
  ),
  language: z.string().min(1, "Language is required"),
  bestSeller: z.boolean(),
  price: z.number().min(1, "Price must be at least 1"),
  discountPrice: z.number().min(0, "Discount price must be non-negative").optional(),
  isDiscounted: z.boolean(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  isArchived: z.boolean(),
  isDeleted: z.boolean(),
  previewVideoUrl: z.string().url("Invalid URL format").optional(),
  coverImageUrl: z.string().optional(),
  whatYouWillLearn: z.array(z.object({ value: z.string().min(1, "Learning point cannot be empty") })),
  requirements: z.array(z.object({ value: z.string().min(1, "Requirement cannot be empty") })),
  overview: z
    .string()
    .min(10, "Overview must be at least 10 characters")
    .max(500, "Overview must be less than 500 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  instructor: z
    .string()
    .min(1, "Instructor name is required")
    .max(100, "Instructor name must be less than 100 characters"),
  skillLevel: z.string().min(1, "Skill level is required"),
  noOfQuizzes: z.number().min(0, "Number of quizzes must be non-negative"),
  hasCertificate: z.boolean(),
  passPercentage: z.number().min(0).max(100, "Pass percentage must be between 0 and 100"),
  categoryId: z.string().min(1, "Category is required"),
  onlineLearning: z.boolean(),
  inPersonLearning: z.boolean(),
});

export default function AddCourseStepper() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const courseId = searchParams.get("courseId");
  const [activeStep, setActiveStep] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  const router = useRouter();

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`);
      return response.data.data;
    },
    enabled: isEditMode && !!courseId,
  });

  const { data: categories } = useQuery({
    queryKey: ["course-categories-list"],
    queryFn: async () => {
      const response = await api.get("/course-categories?showBlocked=false");
      return response.data.data;
    },
    initialData: [],
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema as z.ZodType<CourseFormData>),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      startDate: new Date(),
      language: "English",
      bestSeller: false,
      price: 0,
      discountPrice: 0,
      isDiscounted: false,
      isFeatured: false,
      isPublished: false,
      isArchived: false,
      isDeleted: false,
      previewVideoUrl: "",
      coverImageUrl: "",
      whatYouWillLearn: [],
      requirements: [],
      overview: "",
      description: "",
      instructor: "",
      skillLevel: "Beginner",
      noOfQuizzes: 0,
      hasCertificate: false,
      passPercentage: 70,
      categoryId: "",
      onlineLearning: true,
      inPersonLearning: true,
    },
  });

  useEffect(() => {
    if (course && isEditMode) {
      reset({
        ...course,
        whatYouWillLearn: course.whatYouWillLearn.map((point: string) => ({ value: point })),
        requirements: course.requirements.map((req: string) => ({ value: req })),
      });
      if (course.coverImageUrl) {
        setPreviewImage(course.coverImageUrl);
      }
    }
  }, [course, isEditMode, reset]);

  useEffect(() => {
    if (activeStep === 0) {
      const categoryId = watch("categoryId");
      const validCategoryIds = (categories || []).map((cat: { _id: string }) => cat._id);
      if (categoryId && validCategoryIds.includes(categoryId)) {
        trigger("categoryId");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("categoryId"), activeStep, categories]);

  const {
    fields: learningPoints,
    append: appendLearningPoint,
    remove: removeLearningPoint,
  } = useFieldArray({
    control,
    name: "whatYouWillLearn",
    rules: { required: true },
  });

  const {
    fields: requirements,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
    rules: { required: true },
  });

  const steps = ["Basic Information", "Course Details", "Pricing & Features", "Media & Completion"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("coverImageUrl", URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    // Prevent advancing if already on the last step
    if (activeStep >= steps.length - 1) return;

    let isValid = true;
    const currentStepFields = getCurrentStepFields(activeStep);

    // Additional check for categoryId on step 0
    if (activeStep === 0) {
      const categoryId = watch("categoryId");
      const validCategoryIds = (categories || []).map((cat: { _id: string }) => cat._id);
      if (!categoryId || !validCategoryIds.includes(categoryId)) {
        isValid = false;
        // Optionally, trigger validation for categoryId to show error
        await trigger("categoryId");
      }
    }

    // Validate all fields in the current step
    for (const field of currentStepFields) {
      const result = await trigger(field as any);
      if (!result) {
        isValid = false;
      }
    }

    // Only increment if not on the last step
    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const getCurrentStepFields = (step: number): string[] => {
    switch (step) {
      case 0:
        return ["title", "slug", "overview", "whatYouWillLearn", "requirements", "description", "instructor"];
      case 1:
        return ["language", "skillLevel", "startDate"];
      case 2:
        return ["price", "discountPrice", "isDiscounted", "bestSeller", "isFeatured"];
      case 3:
        return ["coverImageUrl", "previewVideoUrl"];
      default:
        return [];
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const endpoint = isEditMode ? `/courses/${courseId}` : "/courses";
      const method = isEditMode ? "patch" : "post";
      const response = await api[method](endpoint, {
        ...data,
        whatYouWillLearn: data.whatYouWillLearn.map((point) => point.value),
        requirements: data.requirements.map((req) => req.value),
      });
      return response.data;
    },
    onSuccess: () => {
      showToast(`Course ${isEditMode ? "updated" : "created"} successfully`, "success");
      router.push(`/dashboard?item=viewCourses`);
      setSuccess(true);
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} course`;
      showToast(message, "error");
      console.error(`Error ${isEditMode ? "updating" : "creating"} course:`, error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    if (!submitClicked) return; // Only submit if button was actually clicked
    setIsSubmitting(true);
    setSubmitClicked(false); // Reset for next time
    createCourseMutation.mutate(data);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <FormField
              label="Category *"
              description="Select the course category"
              {...register("categoryId")}
              value={watch("categoryId")}
              onChange={(e) => setValue("categoryId", e.target.value)}
              error={errors.categoryId?.message}
              select
              required
              options={[
                { value: "", label: "Select a category" },
                ...((categories || [])?.map((category: { _id: string; name: string }) => ({
                  value: category._id,
                  label: category.name,
                })) || []),
              ]}
            />
            <FormField
              label="Course Title *"
              description="Enter the full title of the course."
              placeholder="Introduction to React"
              {...register("title")}
              error={errors.title?.message}
              required
            />
            <FormField
              label="Subtitle"
              description="A brief subtitle for your course."
              placeholder="Learn React from scratch"
              {...register("subtitle")}
              error={errors.subtitle?.message}
            />
            <FormField
              label="Slug *"
              description="A URL-friendly version of the title."
              placeholder="introduction-to-react"
              {...register("slug")}
              error={errors.slug?.message}
              required
            />
            <FormField
              label="Overview *"
              description="A brief overview of what students will learn."
              placeholder="Course overview..."
              {...register("overview")}
              error={errors.overview?.message}
              textarea
              required
            />
            <div className="@container mt-6 max-w-full w-[705px]">
              <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
                <div className="grow shrink-0 basis-0 w-full">
                  <label className="text-base text-neutral-900">What You'll Learn *</label>
                  <p className="mt-1 text-sm text-gray-500">Add key learning outcomes for this course</p>
                </div>
                <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
                  <div className="space-y-2">
                    {learningPoints.map((field, index) => (
                      <div key={`learning-point-${index}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          {...register(`whatYouWillLearn.${index}.value` as const)}
                          placeholder="Enter a learning point"
                          className="flex-1 overflow-hidden gap-1.5 self-stretch px-4 py-3 rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px] text-black"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeLearningPoint(index)}
                          className="p-2 text-red-500 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendLearningPoint({ value: "" })}
                      className="px-4 py-2 text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                      + Add Learning Point
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="@container mt-6 max-w-full w-[705px]">
              <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
                <div className="grow shrink-0 basis-0 w-full">
                  <label className="text-base text-neutral-900">Requirements *</label>
                  <p className="mt-1 text-sm text-gray-500">Add prerequisites for this course</p>
                </div>
                <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
                  <div className="space-y-2">
                    {requirements.map((field, index) => (
                      <div key={`requirement-${index}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          {...register(`requirements.${index}.value` as const)}
                          placeholder="Enter a requirement"
                          className="flex-1 overflow-hidden gap-1.5 self-stretch px-4 py-3 rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px] text-black"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="p-2 text-red-500 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => appendRequirement({ value: "" })}
                      className="px-4 py-2 text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                      + Add Requirement
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              label="Description *"
              description="Provide a detailed description of the course content."
              placeholder="Course description..."
              {...register("description")}
              error={errors.description?.message}
              textarea
              required
            />
            <FormField
              label="Instructor *"
              description="Name of the course instructor."
              placeholder="John Doe"
              {...register("instructor")}
              error={errors.instructor?.message}
              required
            />
          </>
        );
      case 1:
        return (
          <>
            <FormField
              label="Language *"
              description="Select the primary language of instruction."
              {...register("language")}
              error={errors.language?.message}
              select
              required
              options={[
                { value: "English", label: "English" },
                { value: "Spanish", label: "Spanish" },
                { value: "French", label: "French" },
              ]}
            />
            <FormField
              label="Skill Level *"
              description="Select the target skill level for this course."
              {...register("skillLevel")}
              error={errors.skillLevel?.message}
              select
              required
              options={[
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]}
            />
            <FormField
              label="Start Date *"
              description="When the course will be available."
              error={errors.startDate?.message}
              required
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={(() => {
                const val = watch("startDate");
                if (!val) return "";
                if (typeof val === "string") return val;
                if (val instanceof Date && !isNaN(val.getTime())) return val.toISOString().split("T")[0];
                return "";
              })()}
              onChange={(e) => {
                if (!e.target.value) {
                  setValue("startDate", null as any);
                } else {
                  setValue("startDate", new Date(e.target.value));
                }
              }}
              name="startDate"
            />
          </>
        );
      case 2:
        return (
          <>
            <FormField
              label="Price (USD) *"
              description="Set the price for this course in US dollars."
              placeholder="99"
              {...register("price", { valueAsNumber: true })}
              error={errors.price?.message}
              type="number"
              required
            />
            <FormField
              label="Discount Price (USD)"
              description="Optional discounted price for the course."
              placeholder="79"
              {...register("discountPrice", { valueAsNumber: true })}
              error={errors.discountPrice?.message}
              type="number"
            />
            <div className="@container mt-6 max-w-full w-[705px]">
              <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
                <div className="grow shrink-0 basis-0 w-full">
                  <label className="text-base text-neutral-900">Course Features</label>
                  <p className="mt-1 text-sm text-gray-500">Configure additional course settings</p>
                </div>
                <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
                  <div className="space-y-4">
                    <Controller
                      name="isDiscounted"
                      control={control}
                      render={({ field }) => (
                        <ToggleOption
                          label="Enable Discount"
                          description="Offer this course at a discounted price"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Controller
                      name="bestSeller"
                      control={control}
                      render={({ field }) => (
                        <ToggleOption
                          label="Mark as Best Seller"
                          description="Display a best seller badge on the course"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <ToggleOption
                          label="Feature this Course"
                          description="Show this course in featured sections"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="@container mt-6 max-w-full w-[705px]">
              <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
                <div className="grow shrink-0 basis-0 w-full">
                  <label className="text-base text-neutral-900">Course Image</label>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a cover image for your course. Recommended size: 1200x800 pixels.
                  </p>
                </div>
                <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg bg-slate-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                      {previewImage ? (
                        <img src={previewImage} alt="Course preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 bg-white text-neutral-900 hover:bg-slate-50 transition-colors"
                      >
                        {watch("coverImageUrl") ? "Change Image" : "Upload Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              label="Preview Video URL"
              description="Optional URL for a course preview video."
              placeholder="https://youtube.com/watch?v=..."
              {...register("previewVideoUrl")}
              error={errors.previewVideoUrl?.message}
            />

            <div className="@container mt-6 max-w-full w-[705px]">
              <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
                <div className="grow shrink-0 basis-0 w-full">
                  <label className="text-base text-neutral-900">Learning Modes</label>
                  <p className="mt-1 text-sm text-gray-500">Select how this course is available</p>
                </div>
                <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
                  <div className="space-y-4">
                    <Controller
                      name="onlineLearning"
                      control={control}
                      render={({ field }) => (
                        <ToggleOption
                          label="E-Learning"
                          description="This course is available for E-Learning"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Controller
                      name="inPersonLearning"
                      control={control}
                      render={({ field }) => (
                        <ToggleOption
                          label="On-Site Learning"
                          description="This course is available for On-Site Learning"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Add New Course</h2>

      {success && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">Course added successfully!</div>}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === activeStep
                      ? "bg-primary text-white"
                      : index < activeStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">{step}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div
                    className={`h-full ${index < activeStep ? "bg-green-500" : "bg-gray-200"}`}
                    style={{ width: index < activeStep ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)}>
        {renderStepContent(activeStep)}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={activeStep === 0}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          {activeStep === steps.length - 1 ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
              onClick={() => setSubmitClicked(true)}
            >
              {isSubmitting ? "Submitting..." : "Submit Course"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
