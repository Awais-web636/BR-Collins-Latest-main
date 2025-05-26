"use client";
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCreatePayload, IUser } from "@/app/types/user.contract";
import { ENUMS } from "@/app/constants/enum";
import { REGEX } from "@/app/constants/regex";
import FormField from "./FormField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { getRefreshToken } from "@/app/store/features/users/userSlice";
import { useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/app/store/features/users/userSlice";
import { useSearchParams, useRouter } from "next/navigation";

export default function AddUser() {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refreshToken = useAppSelector(getRefreshToken);
  const user = useAppSelector(selectUser) as IUser;
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const userId = searchParams.get("userId");
  const router = useRouter();

  const userSchema = z
    .object({
      firstName: z
        .string()
        .min(1, "First name is required")
        .max(30, "First name must be at most 30 characters")
        .regex(/^[A-Za-z\s'-]+$/, "First name can only contain letters, spaces, apostrophes, and hyphens"),
      lastName: z
        .string()
        .min(1, "Last name is required")
        .max(30, "Last name must be at most 30 characters")
        .regex(/^[A-Za-z\s'-]+$/, "Last name can only contain letters, spaces, apostrophes, and hyphens"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          REGEX.PASSWORD,
          "Password must be 8-15 characters, include at least one uppercase letter, one lowercase letter, and one number."
        )
        .optional()
        .or(z.literal("")),
      role: z.enum(ENUMS.USER_TYPES as unknown as [string, string, string]),
      profilePicture: z.string().optional(),
    })
    .refine(
      (data) => {
        // If we're in edit mode, password is optional
        if (isEditMode) return true;
        // If we're creating a new user, password is required
        return !!data.password;
      },
      {
        message: "Password is required",
        path: ["password"],
      }
    );

  type UserFormData = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "student",
      profilePicture: "",
    },
  });

  // Fetch user data if in edit mode
  const { data: userData } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data.data;
    },
    enabled: isEditMode && !!userId,
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (userData) {
      setValue("firstName", userData.firstName);
      setValue("lastName", userData.lastName);
      setValue("email", userData.email);
      setValue("role", userData.role);
      setValue("profilePicture", userData.profilePicture || "");
      if (userData.profilePicture) {
        setPreviewImage(userData.profilePicture);
      }
    }
  }, [userData, setValue]);

  // Set role to student if user is a manager
  useEffect(() => {
    if (user.role === "manager") {
      setValue("role", "student");
    }
  }, [user.role, setValue]);

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const endpoint = isEditMode ? `/users/${userId}` : "/users";
      const method = isEditMode ? "patch" : "post";
      const response = await api[method](endpoint, data, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      showToast(`User ${isEditMode ? "updated" : "created"} successfully`, "success");
      reset();
      setPreviewImage(null);
      router.push("/dashboard?item=viewUsers");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} user`;
      showToast(message, "error");
      console.error(`Error ${isEditMode ? "updating" : "creating"} user:`, error);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real implementation, you would upload the file and get the URL
      setValue("profilePicture", URL.createObjectURL(file));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    // Remove password from data if it's empty (edit mode)
    if (isEditMode && !data.password) {
      delete data.password;
    }
    createUserMutation.mutate(data);
  };

  console.log(errors);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">{isEditMode ? "Edit User" : "Add New User"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {user.role !== "manager" && (
          <FormField
            label="Role *"
            description="Select the user's role"
            {...register("role")}
            error={errors.role?.message}
            select
            required
            options={ENUMS.USER_TYPES.map((role) => ({
              value: role,
              label: role.charAt(0).toUpperCase() + role.slice(1),
            }))}
          />
        )}

        <FormField
          label="First Name *"
          description="Enter the user's first name"
          placeholder="Enter first name"
          maxLength={30}
          {...register("firstName")}
          error={errors.firstName?.message}
          required
        />

        <FormField
          label="Last Name *"
          description="Enter the user's last name"
          placeholder="Enter last name"
          maxLength={30}
          {...register("lastName")}
          error={errors.lastName?.message}
          required
        />

        <FormField
          label="Email *"
          description="Enter the user's email address"
          placeholder="Enter email"
          {...register("email")}
          error={errors.email?.message}
          type="email"
          required
          disabled={isEditMode}
        />

        {!isEditMode && (
          <FormField
            label="Password *"
            description="Enter a secure password"
            placeholder="Enter password"
            {...register("password")}
            error={errors.password?.message}
            type="password"
            required
          />
        )}

        <div className="@container max-w-full w-[705px]">
          <div className="flex flex-wrap flex-col @[480px]:flex-row gap-2 @[480px]:gap-10">
            <div className="grow shrink-0 basis-0 w-full">
              <label className="text-base text-neutral-900">Profile Picture</label>
              <p className="mt-1 text-sm text-gray-500">Upload a profile picture for the user</p>
            </div>
            <div className="grow shrink-0 text-base text-gray-400 basis-0 w-full">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-slate-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
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
                    {watch("profilePicture") ? "Change Image" : "Upload Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {createUserMutation.isPending ? "Submitting..." : isEditMode ? "Update User" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
}
