"use client";

import * as React from "react";
import { Calendar } from "./Calendar";
import { CourseSelection } from "./CourseSelection";
import { TimeSlots } from "./TimeSlots";
import { api } from "@/app/utils/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PaymentForm } from "./PaymentForm";
import { useAppSelector } from "@/app/store/hooks";
import { getRefreshToken, getAccessToken, selectUser } from "@/app/store/features/users/userSlice";
import LoginRequiredModal from "@/app/components/pricing/LoginRequiredModal";
import { ICourse } from "@/app/types/course.contract";

export interface BookingState {
  courseDuration: "half-day" | "full-day";
  price: number;
  selectedDate: Date;
  selectedSlot: string;
  currentMonth: Date;
  courseId: string;
}

interface InPersonPopupProps {
  onClose: () => void;
  courseId?: string;
}

function InPersonPopup({ onClose, courseId }: InPersonPopupProps) {
  const [bookingState, setBookingState] = React.useState<BookingState>({
    courseDuration: "half-day",
    price: 1495,
    selectedDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    selectedSlot: "Morning, 8:00 AM - 12:00 PM",
    currentMonth: new Date(),
    courseId: courseId || "",
  });

  const [showPaymentForm, setShowPaymentForm] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const accessToken = useAppSelector(getAccessToken);
  const [courseError, setCourseError] = React.useState("");
  const user = useAppSelector(selectUser) as any;
  const isAdmin = user && typeof user === "object" && "role" in user && user.role === "admin";

  // Fetch all courses for dropdown
  const { data: courses = [], isLoading: isCoursesLoading } = useQuery({
    queryKey: ["courses-dropdown"],
    queryFn: async () => {
      const response = await api.get("/courses?showBlocked=false");
      return response.data.data;
    },
  });

  // Find the selected course object
  const selectedCourse = React.useMemo(
    () => courses.find((c: ICourse) => c._id === bookingState.courseId),
    [courses, bookingState.courseId]
  );

  // Handle course change from dropdown
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCourseId = e.target.value;
    const newCourse = courses.find((c: ICourse) => c._id === newCourseId);
    setBookingState({
      courseDuration: "half-day",
      price: 1495,
      selectedDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      selectedSlot: "Morning, 8:00 AM - 12:00 PM",
      currentMonth: new Date(),
      courseId: newCourseId,
    });
    if (newCourseId) {
      setCourseError("");
    }
  };

  const fetchAvailableSlots = async (date: Date) => {
    // Check if the month is previous to current month
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const selectedMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    if (selectedMonth < currentMonth) {
      console.log("Skipping API call for previous month");
      return [];
    }

    // Only fetch slots for the current month being displayed
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const startDate = firstDayOfMonth.toISOString().split("T")[0];
    const endDate = lastDayOfMonth.toISOString().split("T")[0];

    try {
      const response = await api.get(`/appointments/available-slots?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching available slots:", error);
      return [];
    }
  };

  const { data: availableSlots = [], isLoading } = useQuery({
    queryKey: ["availableSlots", bookingState.currentMonth],
    queryFn: () => fetchAvailableSlots(bookingState.currentMonth),
    enabled: bookingState.currentMonth >= new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  });

  const handleCourseSelection = (duration: "half-day" | "full-day") => {
    setBookingState((prev) => ({
      ...prev,
      courseDuration: duration,
      price: duration === "half-day" ? 1495 : 1995,
      selectedSlot: duration === "full-day" ? "Full Day, 8:00 AM - 5:00 PM" : "Morning, 8:00 AM - 12:00 PM",
    }));
  };

  const handleDateSelection = (date: Date) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleTimeSlotSelection = (slot: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedSlot: slot,
    }));
  };

  const handleMonthChange = (date: Date) => {
    setBookingState((prev) => ({
      ...prev,
      currentMonth: date,
    }));
  };

  const handleProceedToPayment = () => {
    if (isAdmin) {
      return;
    }
    if (!bookingState.courseId) {
      setCourseError("Please select a course before proceeding to payment.");
      return;
    }
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }
    setIsVisible(false);
    setTimeout(() => {
      setShowPaymentForm(true);
    }, 300);
  };

  const handlePaymentClose = () => {
    setShowPaymentForm(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isSelectedSlotAvailable = React.useMemo(() => {
    if (!bookingState.selectedDate || !availableSlots.length) {
      return false;
    }
    const selectedDateObj = new Date(bookingState.selectedDate);
    const formattedDate = selectedDateObj.toISOString().split("T")[0];
    const dateSlots = availableSlots.find(
      (slot: { date: string; availableSlots: string[] }) => slot.date === formattedDate
    );
    if (!dateSlots) return false;
    if (bookingState.courseDuration === "full-day") {
      return dateSlots.availableSlots.includes("full-day");
    } else {
      if (bookingState.selectedSlot === "Morning, 8:00 AM - 12:00 PM") {
        return dateSlots.availableSlots.includes("half-day-morning");
      } else if (bookingState.selectedSlot === "Afternoon, 1:00 PM - 5:00 PM") {
        return dateSlots.availableSlots.includes("half-day-afternoon");
      }
    }
    return false;
  }, [bookingState.selectedDate, bookingState.selectedSlot, bookingState.courseDuration, availableSlots]);

  return (
    <div className="rounded max-w-[1102px] relative max-h-[90vh] overflow-y-auto">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-neutral-900">Loading available slots...</p>
          </div>
        </div>
      )}
      {showPaymentForm && <PaymentForm bookingState={bookingState} onClose={handlePaymentClose} />}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        reason="to book an in-person training"
      />
      <div className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <button className="absolute top-4 right-4 z-10" onClick={onClose}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/179dd092ac1215fe4beb3a0ff1267359fcb77bcb?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
            alt="Close"
            className="w-[18px] aspect-square"
          />
        </button>
        <div className="flex items-stretch h-full max-lg:flex-col max-lg:min-h-[80vh]">
          <div className="w-[70%] max-lg:ml-0 max-lg:w-full max-lg:h-auto">
            <div className="flex flex-col h-full py-12 pr-5 pl-14 mx-auto w-full rounded-l-3xl max-lg:rounded-t-3xl max-lg:rounded-b-none bg-slate-100 max-lg:pl-5 max-lg:max-w-full max-lg:overflow-y-auto">
              <h1 className="self-center lg:self-start text-4xl font-bold text-neutral-900 max-lg:max-w-full">
                In-Person Training Booking
              </h1>

              {/* Course Dropdown (only if courseId is not provided as a prop) */}
              {(!courseId || courseId === "") && (
                <div className="mt-6 mb-6 relative w-full">
                  <label htmlFor="course-dropdown" className="block text-2xl font-bold mb-2 text-neutral-900">
                    Select Course:
                  </label>
                  {isCoursesLoading ? (
                    <div className="text-gray-500 text-base">Loading courses...</div>
                  ) : (
                    <div className="relative">
                      <select
                        id="course-dropdown"
                        className="appearance-none w-full px-5 py-3 pr-12 rounded-xl border border-zinc-200 bg-white shadow focus:ring-2 focus:ring-primary focus:border-primary text-lg font-medium text-neutral-900 transition-all duration-200 outline-none cursor-pointer hover:border-primary"
                        value={bookingState.courseId}
                        onChange={handleCourseChange}
                      >
                        <option value="">Select Course</option>
                        {courses.map((course: ICourse) => (
                          <option key={course._id} value={course._id} className="text-base">
                            {course.title} {course.price ? `($${course.price})` : ""}
                          </option>
                        ))}
                      </select>
                      {/* Chevron Icon */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {courseError && (
                        <div className="mt-2 text-red-600 text-base font-medium bg-red-50 border border-red-200 rounded px-3 py-2">
                          {courseError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <CourseSelection onSelect={handleCourseSelection} selectedDuration={bookingState.courseDuration} />

              <hr className="shrink-0 mt-5 h-px bg-white border border-solid border-zinc-200 max-md:max-w-full" />

              <div className="mt-5 mr-5 max-md:mr-2.5 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                  <div className="w-5/12 max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col text-neutral-900 max-md:mt-10">
                      <h2 className="text-2xl font-bold">View Calendar & Select Date:</h2>
                      <p className="self-start mt-3.5 text-base leading-6">
                        Click on a date to see time slot availability.
                      </p>
                    </div>
                  </div>
                  <div className="ml-5 w-7/12 max-md:ml-0 max-md:w-full max-lg:flex max-lg:justify-center">
                    <Calendar
                      selectedDate={bookingState.selectedDate}
                      onDateSelect={handleDateSelection}
                      onMonthChange={handleMonthChange}
                      availableSlots={availableSlots}
                    />
                  </div>
                </div>
              </div>

              <hr className="shrink-0 mt-5 h-px bg-white border border-solid border-zinc-200 max-md:max-w-full" />

              <TimeSlots
                onSelect={handleTimeSlotSelection}
                selectedSlot={bookingState.selectedSlot}
                courseDuration={bookingState.courseDuration}
                availableSlots={availableSlots}
                selectedDate={bookingState.selectedDate}
              />
            </div>
          </div>

          <div className="w-[30%] max-lg:ml-0 max-lg:w-full max-lg:overflow-y-auto">
            <div className="h-full flex flex-col justify-stretch grow py-7 w-full text-lg bg-white rounded-r-3xl max-lg:rounded-t-none max-lg:rounded-b-3xl text-neutral-900">
              <div className="flex flex-col px-6 mt-4 w-full max-md:px-5 h-full">
                <h2 className="self-start text-2xl font-bold">Details Overview</h2>
                <div className="mt-16 max-md:mt-10 max-md:mr-2">
                  <div className="flex flex-col justify-center max-w-full min-h-[53px]">
                    <p>Course Duration:</p>
                    <p className="mt-1 font-bold text-left">
                      {bookingState.courseDuration === "half-day" ? "Half-Day" : "Full-Day"}
                    </p>
                  </div>
                  <hr className="mt-2 max-w-full bg-white border border-solid border-zinc-200 min-h-px" />

                  <div className="flex flex-col justify-center mt-4 max-w-full min-h-[53px]">
                    <p>Course Price:</p>
                    <p className="mt-1 font-bold text-left">${bookingState.price}</p>
                  </div>
                  <hr className="mt-2 max-w-full bg-white border border-solid border-zinc-200 min-h-px" />

                  <div className="flex flex-col justify-center mt-4 max-w-full min-h-[53px]">
                    <p>Selected Date:</p>
                    <p className="mt-1 font-bold text-left">{formatDateForDisplay(bookingState.selectedDate)}</p>
                  </div>
                  <hr className="mt-4 max-w-full bg-white border border-solid border-zinc-200 min-h-px" />

                  <div className="flex flex-col justify-center mt-1 max-w-full min-h-[53px]">
                    <p>Selected Slot(s):</p>
                    <p className="mt-1 font-bold text-left">{bookingState.selectedSlot}</p>
                  </div>
                </div>

                <div className="mt-auto pt-8 w-full">
                  {isAdmin && (
                    <div className="mb-4 w-full text-center text-base font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg py-3 px-4">
                      Admin users cannot book an appointment.
                    </div>
                  )}
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!isSelectedSlotAvailable || isAdmin}
                    className={`flex w-full overflow-hidden gap-1.5 justify-center items-center px-5 py-3  mb-4 font-medium text-white bg-primary hover:bg-primary-hover transition-all duration-200 min-h-[58px] rounded-[58px] max-md:px-5 max-md:mt-10 ${
                      !isSelectedSlotAvailable || isAdmin ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="self-stretch my-auto">Proceed to Payment</span>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0889cf0590565dbb9aabef07a57290e2c923c555?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                      alt="Arrow right"
                      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InPersonPopup;
