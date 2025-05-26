// components/Register.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import loginimage from "../../../public/img/login/loginimage.png";
import B from "../../../public/img/login/Bb.png";
import logo from "../../../public/img/login/lowerlogo.png";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { isUserLoggedIn } from "@/app/store/features/users/userSlice";
import { REGEX } from "@/app/constants/regex";

const registerSchema = z
  .object({
    userType: z.enum(["student", "manager"], {
      required_error: "Please select a user type",
      invalid_type_error: "Please select a user type",
    }),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        REGEX.PASSWORD,
        "Password must be 8-15 characters, include at least one uppercase letter, one lowercase letter, and one number."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLoggedIn = useAppSelector(isUserLoggedIn);

  React.useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: undefined,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      data.email = data.email.toLowerCase();
      const response = await api.post("/auth/register", {
        ...data,
        role: data.userType,
      });
      return response.data;
    },
    onSuccess: () => {
      showToast("Registration successful!", "success");
      router.push("/login");
    },
    onError: (error: any) => {
      // showToast("Registration failed. Please try again.", "error");
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      showToast(message, "error");
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <section className="">
      <div className="flex flex-col lg:flex-row w-full bg-primary">
        {/* Left Side */}
        <div className="w-full lg:w-2/3 bg-secondary text-white relative py-12 lg:py-0">
          <div className="absolute bottom-0 w-full lg:w-[712px]">
            <Image src={B} alt="Decorative background element" className="w-full" />
          </div>
          <div className="w-full px-6 lg:w-[630px] mx-auto flex flex-col gap-8 justify-center items-start lg:h-full relative z-10 py-8">
            <Link href="/login" className="w-12 h-12 rounded-full bg-secondary-dark flex items-center justify-center">
              <IoArrowBackOutline className="w-7 h-7 text-white" />
            </Link>
            <div>
              <Image src={logo} alt="Company logo" className="h-10 w-auto" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-2xl font-bold font-hanken text-white">Register Your Account</h1>
              <p className="text-gray-300">
                Asterisks (<span className="text-org font-bold">*</span>) indicate required fields.
              </p>
            </div>

            {/* User Type Selection */}
            <div className="w-full">
              <h2 className="text-white mb-4">
                Select User Type <span className="text-org">*</span>
              </h2>
              {watch("userType") === "manager" && (
                <p className="text-white text-sm mb-4 bg-secondary-dark p-3 rounded-lg">
                  <span className="font-bold">Note:</span> It is recommended to use your organization's official email
                  address for registration. The registered email will be treated as the manager for the organization.
                </p>
              )}
              <div className="flex flex-wrap gap-6">
                {(["student", "manager"] as const).map((type) => (
                  <label key={type} className="inline-flex items-center cursor-pointer">
                    <input type="radio" value={type} {...register("userType")} className="peer hidden" />
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:bg-primary peer-checked:border-org transition-colors">
                      <svg
                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="ml-2 text-white capitalize">{type === 'student' ? 'Student' : 'Organizaition'}</span>
                  </label>
                ))}
              </div>
              {errors.userType && <p className="text-white text-xs mt-1">{errors.userType.message}</p>}
            </div>

            {/* Registration Form */}
            <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <div className="flex-1">
                  <input
                    type="text"
                    {...register("firstName")}
                    className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org w-full"
                    placeholder={watch("userType") === "manager" ? "Manager's first name" : "Enter your first name"}
                  />
                  {errors.firstName && <p className="text-white text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    {...register("lastName")}
                    className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org w-full"
                    placeholder={watch("userType") === "manager" ? "Manager's last name" : "Enter your last name"}
                  />
                  {errors.lastName && <p className="text-white text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                  placeholder={watch("userType") === "manager" ? "Manager's email" : "Enter your email"}
                />
                {errors.email && <p className="text-white text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                {errors.password && <p className="text-white text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <p className="text-white text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                className="bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 bg-primary hover:bg-primary-dark duration-300"
              >
                {isSubmitting || registerMutation.isPending ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-org underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="hidden lg:block lg:w-1/3">
          <Image src={loginimage} alt="Login illustration" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default Register;
