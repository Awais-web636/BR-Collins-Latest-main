import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken, setRefreshToken } from "@/app/store/features/users/userSlice";
import { IoMdArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  reason = "to access our subscription plans",
}) => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (res) => {
      const data = res.data;
      dispatch(setUser(data.user));
      dispatch(setAccessToken(data.accessToken));
      dispatch(setRefreshToken(data.refreshToken));
      showToast("Login successful", "success");
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      showToast(message, "error");
      console.error("Login error:", error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900">Login Required</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mb-8 text-center">
            You need to be logged in {reason}. Please log in to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <input
                  type="email"
                  {...register("email")}
                  required
                  placeholder="Email*"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    required
                    placeholder="Password*"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded focus:outline-none"
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-3 cursor-pointer group">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer hidden"
                  />
                  <div className="h-5 w-5 rounded-lg border-2 border-gray-200 flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-colors">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
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
                  <span className="ml-2 text-gray-600 font-light transition-colors group-hover:text-gray-800">
                    Remember me
                  </span>
                </label>
              </div>
              <div>
                <Link
                  href={"/forgot-password?next=/subscriptions"}
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="bg-primary text-white gap-2 items-center flex flex-row py-3 px-6 rounded-xl font-medium hover:bg-primary-hover w-full justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isSubmitting || loginMutation.isPending ? "Logging in..." : "Login"}{" "}
              <span>
                <IoMdArrowForward className="flex flex-row items-center justify-center my-auto" />
              </span>
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              href={"/register?next=/subscriptions"}
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
