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
import { useDispatch } from "react-redux";
import {
  setUser,
  setAccessToken,
  setRefreshToken,
  selectUser,
  getRefreshToken,
} from "@/app/store/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { IUser } from "../types/user.contract";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  officialEmail: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  address: z.object({
    venueName: z.string().min(2, "Venue name must be at least 2 characters"),
    streetAddress: z.string().min(5, "Please enter a valid street address"),
    city: z.string().min(2, "Please enter a valid city"),
    state: z.string().min(2, "Please enter a valid state"),
    zipCode: z.string().min(5, "Please enter a valid zip code"),
    additionalInfo: z.string().optional(),
    coordinates: z
      .object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
      .optional(),
  }),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

const RegisterOrganization: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const refreshToken = useAppSelector(getRefreshToken);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      // First register the organization
      const response = await api.post("/organizations/register", data, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const organization = response.data.data;

      // Store tokens and user data in Redux
      const userData = {
        ...user,
        organization: organization._id,
      } as IUser;
      dispatch(setUser(userData));

      // Then register the organization details
      await api.post("/organizations/register", data, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      showToast("Organization registration successful!", "success");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      showToast(message, "error");
      console.error("Registration error:", error);
    },
  });

  const onSubmit = (data: OrganizationFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <section className="">
      <div className="flex flex-col lg:flex-row w-full bg-org">
        {/* Left Side */}
        <div className="w-full lg:w-2/3 bg-secondary text-white relative py-12 lg:py-0">
          <div className="absolute bottom-0 w-full lg:w-[712px]">
            <Image src={B} alt="Decorative background element" className="w-full" />
          </div>
          <div className="w-full px-6 lg:w-[630px] mx-auto flex flex-col gap-8 justify-center items-start lg:h-full relative z-10">
            <Link
              href="/register"
              className="w-12 h-12 rounded-full bg-secondary-dark flex items-center justify-center"
            >
              <IoArrowBackOutline className="w-7 h-7 text-white" />
            </Link>
            <div>
              <Image src={logo} alt="Company logo" className="h-10 w-auto" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-2xl font-bold font-hanken text-white">Register Your Organization</h1>
              <p className="text-gray-300">
                Asterisks (<span className="text-org font-bold">*</span>) indicate required fields.
              </p>
            </div>

            <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Organization Basic Information */}
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Organization name *"
                  />
                  {errors.name && <p className="text-white text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    {...register("officialEmail")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Organization's official email *"
                  />
                  {errors.officialEmail && <p className="text-white text-xs mt-1">{errors.officialEmail.message}</p>}
                </div>
                <div>
                  <input
                    type="url"
                    {...register("website")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Organization website (optional)"
                  />
                  {errors.website && <p className="text-white text-xs mt-1">{errors.website.message}</p>}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Address Information</h3>
                <div>
                  <input
                    type="text"
                    {...register("address.venueName")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Venue name *"
                  />
                  {errors.address?.venueName && (
                    <p className="text-white text-xs mt-1">{errors.address.venueName.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    {...register("address.streetAddress")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Street address *"
                  />
                  {errors.address?.streetAddress && (
                    <p className="text-white text-xs mt-1">{errors.address.streetAddress.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      {...register("address.city")}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                      placeholder="City *"
                    />
                    {errors.address?.city && <p className="text-white text-xs mt-1">{errors.address.city.message}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      {...register("address.state")}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                      placeholder="State *"
                    />
                    {errors.address?.state && <p className="text-white text-xs mt-1">{errors.address.state.message}</p>}
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    {...register("address.zipCode")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="ZIP code *"
                  />
                  {errors.address?.zipCode && (
                    <p className="text-white text-xs mt-1">{errors.address.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <textarea
                    {...register("address.additionalInfo")}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:border-org"
                    placeholder="Additional address information (optional)"
                    rows={3}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                className="bg-org text-white py-3 px-6 rounded-full font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 w-full"
              >
                {isSubmitting || registerMutation.isPending ? "Registering..." : "Register Organization"}
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

export default RegisterOrganization;
