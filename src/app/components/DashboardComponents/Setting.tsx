"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "./FormField";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectUser, updateUser, getRefreshToken } from "@/app/store/features/users/userSlice";
import { showToast } from "@/app/utils/toast";
import { api } from "@/app/utils/axios";
import { AxiosError } from "axios";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const PasswordField = ({
  label,
  description,
  showPassword,
  togglePassword,
  error,
  ...props
}: {
  label: string;
  description: string;
  showPassword: boolean;
  togglePassword: () => void;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-wrap gap-10 max-w-full w-[705px]">
      <div className="grow shrink-0 basis-0 w-fit">
        <label className="text-base text-neutral-900">{label}</label>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="grow shrink-0 text-base text-gray-400 basis-0 w-fit">
        <div className="flex overflow-hidden justify-between items-center px-4 py-3 w-full rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px]">
          <div className="flex flex-1 shrink gap-10 justify-between items-end self-stretch my-auto w-full basis-0 min-w-60">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent border-none outline-none text-black"
              {...props}
            />
            <button
              type="button"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

const SettingsForm = () => {
  const user = useAppSelector(selectUser) as any;
  const refreshToken = useAppSelector(getRefreshToken);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Update form values if user changes
  React.useEffect(() => {
    resetProfile({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
    });
  }, [user, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const response = await api.patch("/auth/update-profile", data, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      showToast("Profile updated successfully!", "success");
      dispatch(updateUser(response.data.data));
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Error updating profile.", "error");
      console.error("Error updating profile:", error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      const payload = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      const response = await api.patch("/auth/update-password", payload, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      showToast("Password updated successfully!", "success");
      dispatch(updateUser(response.data.data));
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          showToast("Invalid current password.", "error");
          return;
        }
      }
      showToast(error?.response?.data?.message || "Error updating password.", "error");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Settings</h2>

      <form
        onSubmit={
          activeTab === "profile" ? handleProfileSubmit(onProfileSubmit) : handlePasswordSubmit(onPasswordSubmit)
        }
        className="space-y-6"
        noValidate
      >
        <div className="flex gap-6 items-center mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`text-base ${activeTab === "profile" ? "font-semibold text-sky-500" : "text-neutral-400"}`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`text-base ${activeTab === "password" ? "font-semibold text-sky-500" : "text-neutral-400"}`}
          >
            Password
          </button>
        </div>

        {activeTab === "profile" ? (
          <>
            <FormField
              label="First Name *"
              description="This will be displayed on your profile"
              placeholder="Enter first name"
              {...registerProfile("firstName")}
              error={profileErrors.firstName?.message}
              required
            />

            <FormField
              label="Last Name *"
              description="This will be displayed on your profile"
              placeholder="Enter last name"
              {...registerProfile("lastName")}
              error={profileErrors.lastName?.message}
              required
            />

            <FormField
              label="Email Address *"
              description="Use an active email address"
              placeholder="Enter email"
              {...registerProfile("email")}
              error={profileErrors.email?.message}
              type="email"
              required
              disabled
            />

            <FormField
              label="Bio / About Me"
              description="Short introduction about yourself"
              placeholder="Enter your bio"
              {...registerProfile("bio")}
              error={profileErrors.bio?.message}
              textarea
            />
          </>
        ) : (
          <>
            <PasswordField
              label="Current Password *"
              description="Enter your current password"
              showPassword={showCurrentPassword}
              togglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
              {...registerPassword("currentPassword")}
              error={passwordErrors.currentPassword?.message}
            />

            <PasswordField
              label="New Password *"
              description="Choose a strong password with at least 8 characters"
              showPassword={showNewPassword}
              togglePassword={() => setShowNewPassword(!showNewPassword)}
              {...registerPassword("newPassword")}
              error={passwordErrors.newPassword?.message}
            />

            <PasswordField
              label="Re-type New Password *"
              description="Confirm your new password"
              showPassword={showConfirmPassword}
              togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              {...registerPassword("confirmPassword")}
              error={passwordErrors.confirmPassword?.message}
            />
          </>
        )}

        <div className="flex justify-start mt-8">
          <button
            type="submit"
            disabled={activeTab === "profile" ? isProfileSubmitting : isPasswordSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {activeTab === "profile"
              ? isProfileSubmitting
                ? "Updating Profile..."
                : "Update Profile"
              : isPasswordSubmitting
                ? "Updating Password..."
                : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
