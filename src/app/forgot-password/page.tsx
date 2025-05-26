"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import B from "../../../public/img/login/Bb.png";
import LoginImage from "../../../public/img/login/loginimage.png";
import logo from "../../../public/img/login/lowerlogo.png";
import Link from "next/link";
import { useForm } from "react-hook-form";

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    setSubmitted(true);
    // Placeholder for API call
  };

  return (
    <section className="">
      <div className="flex flex-col lg:flex-row w-full bg-org">
        {/* Left Section */}
        <div className="w-full lg:w-2/3 bg-secondary text-white relative py-12 lg:py-0">
          <div className="absolute bottom-0 w-full lg:w-[712px]">
            <Image src={B} alt="Decorative background" className="w-full h-auto" />
          </div>

          <div className="relative z-10 w-full px-6 lg:w-[630px] mx-auto flex flex-col gap-8 justify-center items-start min-h-[600px] lg:min-h-[700px]">
            <Link href="/login" className="w-12 h-12 rounded-full bg-secondary-dark flex items-center justify-center">
              <IoArrowBackOutline className="w-7 h-7 text-white" />
            </Link>
            <div>
              <Image src={logo} alt="Logo" className="h-10 w-auto" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-2xl font-bold font-hanken text-white">Forgot your password?</h1>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              <p className="text-gray-300">
                Asterisks (<span className="text-org font-bold">*</span>) indicate required fields.
              </p>
            </div>

            {/* Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 space-y-4" noValidate>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    required
                    placeholder="Email*"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-org"
                  />
                  {errors.email && <p className="text-white text-xs">{errors.email.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-org text-white gap-2 items-center flex flex-row py-3 px-6 rounded-full font-base hover:bg-opacity-90 w-fit transition-colors disabled:opacity-50 bg-primary"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}{" "}
                  <span>
                    <IoMdArrowForward className="flex flex-row items-center justify-center my-auto" />
                  </span>
                </button>
              </form>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <p className="text-green-400">If an account with that email exists, a reset link has been sent.</p>
                <Link href="/login" className="text-org underline">
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:block lg:w-1/3">
          <Image src={LoginImage} alt="Login" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
