"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

interface IFormInputs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Mock API call
const mockSubmitForm = async (data: IFormInputs): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 2000); // 2 seconds delay to simulate API call
  });
};

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const result = await mockSubmitForm(data);
      if (result.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset(); // Reset form after successful submission
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <section className="w-full py-20 px-4 md:px-8 lg:px-0 ">
        <div className="max-w-[1326px] mx-auto flex flex-col lg:flex-row gap-10 lg:px-3 px-4">
          {/* Left Section - Contact Info */}
          <div className="flex flex-col gap-8 w-full lg:w-1/2 justify-center ">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl lg:text-[52px] font-bold text-gray-900">Get in Touch with Us</h1>
              <p className="text-gray-600 mt-1 md:text-lg lg:text-xl">
                The quickest way to get in touch with us is by using the contact information below.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 text-gray-800 md:mt-6">
              <div className="flex flex-col gap-1.5">
                <h2 className=" text-lg lg:text-xl">Phone:</h2>
                <p className="font-bold text-xl lg:text-2xl">(406) 555-0120</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className=" text-lg lg:text-xl">Email:</h2>
                <p className="underline font-bold  text-[#2490E0] text-lg lg:text-xl">brcollins@brcollins.com</p>
              </div>
            </div>

            <div className="w-full md:mt-4">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256018566!2d-73.987844924525!3d40.74844097192396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTkuMyJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="300"
                className="rounded-3xl border-0"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-evenly bg-white p-6 sm:p-10 shadow-[0px_4px_75px_rgba(0,0,0,0.06)] rounded-2xl ">
            <h2 className="text-[22px] font-bold text-center text-gray-800 mb-8">
              Get a Free Course You Can Contact With Us
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Your name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 60,
                      message: "Name must be at most 60 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Name can only contain letters and spaces",
                    },
                  })}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="email"
                  placeholder="Your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Subject"
                  {...register("subject", {
                    required: "Subject is required",
                    minLength: {
                      value: 3,
                      message: "Subject must be at least 3 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Subject must be at most 100 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9 .,!?'-]+$/,
                      message: "Subject can only contain letters, numbers, spaces, and . , ! ? ' - characters",
                    },
                  })}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
                {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <textarea
                  rows={4}
                  placeholder="Your message"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Message must be at most 500 characters",
                    },
                  })}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-full font-bold hover:bg-primary-hover transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
