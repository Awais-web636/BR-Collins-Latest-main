"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, selectCartItems } from "@/app/store/features/cart/cartSlice";
import { ICourse } from "@/app/types/course.contract";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const purchasedCourses = useSelector(selectCartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear cart or perform any other post-purchase actions here
    const timer = setTimeout(() => {
      router.push("/dashboard?item=courses");
    }, 5000);

    // Remove all items from cart
    dispatch(clearCart());

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Purchase Successful!</h2>
              <p className="text-gray-500 text-center">
                Thank you for your purchase. You will be redirected to your courses shortly.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-medium text-neutral-900">Your Purchased Courses</h3>
              <div className="space-y-3">
                {purchasedCourses.map((course: ICourse, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={course.coverImageUrl || "/img/Course/Course.png"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-neutral-900">{course.title}</h4>
                      <p className="text-xs text-gray-500">by {course.instructor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard?item=courses"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Go to My Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
