"use client";
import React, { useState, useRef, useEffect } from "react";
import { InstructorSection } from "../../components/CourseDetail/InstructorSection";
import { ReviewSection } from "../../components/CourseDetail/ReviewSection";
import CourseDetail from "../../components/CourseDetail/CourseDetail";
import { StarRating } from "@/app/components/CourseDetail/StarRating";
import { Send, Facebook, Instagram, Linkedin, Twitter, MapPin, Globe, X } from "lucide-react";
import { ICourse } from "@/app/types/course.contract";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { addToCart } from "@/app/store/features/cart/cartSlice";
import InPersonPopup from "@/app/components/inpersonBooking/InPersonPopup";
import { selectUser, getSubscription } from "@/app/store/features/users/userSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { IUser } from "@/app/types/user.contract";
import { ISubscription } from "@/app/types/subscription.contract";

import CourseSwiper from "@/app/components/Course/CourseSwiper";
import Link from "next/link";
import { ICourseContent } from "@/app/types/course-content.contract";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "../../../../public/icons/footer_icons";

const socialIcons = [
  { Icon: FacebookIcon, link: "https://www.facebook.com" },
  { Icon: XIcon, link: "https://www.x.org" },
  { Icon: LinkedInIcon, link: "https://www.linkedin.com" },
  { Icon: InstagramIcon, link: "https://www.instagram.com" },
];

const toTitleCase = (str: string) => {
  return str.replace(/\B([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
};

const CourseDetailPageClient = ({
  course,
}: {
  course: ICourse & {
    content: {
      [string: string]: {
        totalContents: number;
        totalDuration: number;
        contents: ICourseContent[];
      };
    };
  };
}) => {
  console.log("course", course);

  const [showInPersonPopup, setShowInPersonPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const user = useAppSelector(selectUser) as IUser;
  const subscription = useAppSelector(getSubscription) as ISubscription;
  const router = useRouter();
  const searchParams = useSearchParams();

  const overviewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const instructorRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const alreadyInCart = items.some((item) => item._id === course._id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section");
            if (section) {
              setActiveSection(section);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px", // This creates a "center" detection zone
        threshold: 0,
      }
    );

    const sections = [
      { ref: overviewRef, name: "Overview" },
      { ref: contentRef, name: "Course Content" },
      { ref: detailsRef, name: "Details" },
      { ref: instructorRef, name: "Instructor" },
      { ref: reviewRef, name: "Review" },
    ];

    sections.forEach(({ ref, name }) => {
      if (ref.current) {
        ref.current.setAttribute("data-section", name);
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (showInPersonPopup) {
      // Trigger the animation after the component is mounted
      requestAnimationFrame(() => {
        setIsPopupVisible(true);
      });
    } else {
      setIsPopupVisible(false);
    }
  }, [showInPersonPopup]);

  useEffect(() => {
    console.log("searchParams", searchParams);
    const type = searchParams.get("type");

    console.log(type);
    if (type === "in-person") {
      setShowInPersonPopup(true);
    } else if (type === "e-learning") {
      handleAddToCart(true);
    }
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const refs = {
      Overview: overviewRef,
      "Course Content": contentRef,
      Details: detailsRef,
      Instructor: instructorRef,
      Review: reviewRef,
    };

    const ref = refs[section as keyof typeof refs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToCart = (shouldShowSuccessModal: boolean = false) => {
    const isCourseInCart = items.some((item) => item._id === course._id);
    if (!isCourseInCart) {
      dispatch(addToCart(course));
      setShowSuccessModal(true);

      // setTimeout(() => setShowSuccessModal(false), 2500);
    } else {
      if (shouldShowSuccessModal) {
        setShowSuccessModal(true);
      }
    }
  };

  const isManager = user && typeof user === "object" && "role" in user && user.role === "manager";

  const handleSubscriptionRedirect = () => {
    router.push("/subscriptions");
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    // Wait for the animation to complete before hiding the popup
    setTimeout(() => {
      setShowInPersonPopup(false);
    }, 300);
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  // Map API course data to frontend display format
  const displayCourse = {
    slug: course.slug,
    duration: `${course.noOfHours} Hrs`,
    title: toTitleCase(course.title),
    overview: course.overview,
    subtitle: course.subtitle,
    instructor: course.instructor,
    lessons: course.noOfLessons,
    rating: course.rating,
    price: course.isDiscounted && course.discountPrice ? course.discountPrice : course.price,
    percentageOff: course.isDiscounted
      ? course.discountPrice
        ? Math.round((1 - parseFloat(course.discountPrice.toString()) / parseFloat(course.price.toString())) * 100)
        : 0
      : 0,
    originalPrice: course.price,
    isNew: course.bestSeller,
    isDiscounted: course.isDiscounted,
    // imageUrl: course.coverImageUrl,
    imageUrl: "/img/Course/Course.png",
    courseDetails: {
      startDate: course.startDate
        ? course.startDate instanceof Date
          ? course.startDate.toLocaleDateString()
          : new Date(course.startDate).toLocaleDateString()
        : new Date().toLocaleDateString(),
      enrolled: course.noOfStudents || 100,
      lectures: course.noOfLessons,
      skillLevel: course.skillLevel,
      language: course.language,
      quizzes: course.noOfQuizzes,
      certificate: course.hasCertificate ? "Yes" : "No",
      lastUpdated: course.lastUpdated
        ? course.lastUpdated instanceof Date
          ? course.lastUpdated.toLocaleDateString()
          : new Date(course.lastUpdated).toLocaleDateString()
        : new Date().toLocaleDateString(),
    },
    description: course.description,
    learningObjectives: course.whatYouWillLearn,
    requirements:
      course.requirements.length > 0
        ? course.requirements
        : ["This course is for beginners", "No prior knowledge required", "All levels welcome"],
    sections: Object.entries(course.content).map(([key, value]) => ({
      title: key,
      stats: `${value.totalContents} lectures • ${value.totalDuration} minutes`,
      totalContents: value.totalContents,
      totalDuration: value.totalDuration,
      lectures: value.contents.map((item: ICourseContent) => ({
        title: item.title,
        duration: `${parseInt(item.duration)} minutes`,
        type: item.contentType,
        allowPreview: item.allowPreview,
        contentUrl: item.contentUrl,
        contentType: item.contentType,
      })),
    })),
  };

  return (
    <>
      {showInPersonPopup && (
        <div
          className={`fixed inset-0 bg-black/50 z-50 flex items-center p-4 justify-center transition-opacity duration-300 ease-in-out ${
            isPopupVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClosePopup}
        >
          <div
            className={`transform transition-all duration-300 ease-in-out w-full md:w-auto ${
              isPopupVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <InPersonPopup onClose={handleClosePopup} courseId={course._id} />
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-100 px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-neutral-900">Course Added to Cart</h2>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-6 py-8 flex flex-col items-center">
              <p className="text-gray-700 text-base text-center mb-8">
                {alreadyInCart
                  ? "The course has been successfully added to your cart. You can continue browsing or go to your cart to checkout."
                  : "The course has been successfully added to your cart. You can continue browsing or go to your cart to checkout."}
              </p>
              <button
                className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-hover transition-colors text-base"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-neutral-900">
          <section className="flex flex-col items-start mx-auto max-w-[1326px] max-[1020px]:mx-4 pt-5 pb-32 lg:px-2 max-md:pb-24 max-md:px-4 max-md:w-full">
            {/* Breadcrumbs */}
            <nav className="flex gap-1 items-end self-start text-base text-white max-md:items-center">
              <a href="/">Home</a>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f8a4ef21cebf71bbe62d3a6b83740a760828aca?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                alt="Breadcrumb separator"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <a href="/course">Courses</a>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5f8a4ef21cebf71bbe62d3a6b83740a760828aca?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                alt="Breadcrumb separator"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <a href="#" className="font-semibold text-sky-500">
                {displayCourse.title}
              </a>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col mt-24 w-[648px] max-md:mt-10 max-md:w-full">
              <div className="w-full text-white min-h-[196px]">
                <h1 className="text-5xl font-bold leading-[58px] max-md:text-4xl max-md:leading-[49px]">
                  {displayCourse.title}
                </h1>
                <p className="mt-5 text-xl leading-8 max-md:text-lg max-md:leading-7">{displayCourse.subtitle}</p>
              </div>

              {/* Stats Section */}
              <div className="flex flex-col mt-10  max-md:w-full">
                <div className="flex flex-wrap gap-3 items-center w-full">
                  {/* {course.isNew && ( */}
                  <div className="flex gap-1 items-center px-3 py-1.5 text-base font-medium text-black whitespace-nowrap bg-[#FFCA7E] rounded-md max-md:text-sm">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/1099e32fc8790b4b60ad2b6a14e0383d2ac123fe?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                      alt="Bestseller badge"
                      className="object-contain shrink-0 aspect-[0.81] w-[13px]"
                    />
                    <span>Bestseller</span>
                  </div>
                  {/* )} */}

                  {/* Rating */}
                  <div className="flex gap-1.5 items-center">
                    <span className="text-lg font-medium text-white max-md:text-base">
                      {displayCourse.rating || 10}
                    </span>
                    <StarRating rating={displayCourse.rating || 4} />
                    <a href="#" className="text-base text-white underline max-md:text-sm">
                      {displayCourse.lessons}+ rating
                    </a>
                  </div>

                  {/* Divider - hidden on mobile */}
                  <div className="shrink h-5 border border-solid border-white border-opacity-50 max-md:hidden" />

                  {/* Stats */}
                  <div className="flex gap-3 items-center max-md:gap-3 max-md:w-full max-md:justify-start max-md:mt-3">
                    <div className="flex gap-1 items-center">
                      <img
                        src="/img/coursedetail/lesson.svg"
                        alt="Lessons icon"
                        className="object-contain shrink-0 w-5 aspect-square max-md:w-4"
                      />
                      <span className="text-base max-md:text-sm text-white">{displayCourse.lessons} Lessons</span>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <img
                        src="/img/coursedetail/person.svg"
                        alt="Students icon"
                        className="object-contain shrink-0 w-5 aspect-square max-md:w-4"
                      />
                      <span className="text-base max-md:text-sm text-white">
                        {displayCourse.courseDetails.enrolled} Students
                      </span>
                    </div>
                  </div>

                  <div className="flex mt-5 flex-wrap gap-3 items-center">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-base max-md:text-sm text-white">Last updated 2/15/2025</span>
                    </div>
                    <div className="shrink h-5 border border-solid border-white border-opacity-50 max-md:hidden" />
                    <div className="flex gap-1.5 items-center">
                      <MapPin className="w-5 h-5 text-white" />
                      <span className="text-base max-md:text-sm text-white">
                        234 Elm Street, Springfield, USA 90210
                      </span>
                    </div>
                    <div className="shrink h-5 border border-solid border-white border-opacity-50 max-md:hidden" />
                    <div className="flex gap-1.5 items-center">
                      <Globe className="w-5 h-5 text-white" />
                      <span className="text-base max-md:text-sm text-white">English</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex gap-8 lg:mt-20 max-[1024px]:flex-col w-full max-w-[1326px] mx-auto max-lg:px-3 px-2">
        {/* Left Content */}
        <div className="flex-1 max-lg:w-full lg:w-[50%] max-[1020px]:order-2 [1020px]:max-w-[720px] max-[1020px]:w-full max-[1340px]:mx-4">
          <div className="w-full ">
            {/* Course content */}
            <section className="mt-12 max-md:mt-10 ml-auto">
              <div className="flex gap-2 items-center text-3xl text-neutral-900">
                <nav className="flex gap-3 items-center overflow-x-auto whitespace-nowrap max-md:max-w-full bg-white border border-[#E0ECF2] shadow-[0px_4px_75px_rgba(0,0,0,0.06)] rounded-full p-2">
                  {[
                    { label: "Overview", active: activeSection === "Overview" },
                    {
                      label: "Course Content",
                      active: activeSection === "Course Content",
                    },
                    { label: "Details", active: activeSection === "Details" },
                    {
                      label: "Instructor",
                      active: activeSection === "Instructor",
                    },
                    { label: "Review", active: activeSection === "Review" },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSectionClick(item.label)}
                      className={`flex-shrink-0 px-6 py-2 min-h-[40px] rounded-full text-lg font-medium ${
                        item.active ? "bg-[#2490E0] text-white" : "bg-white text-gray-500 hover:bg-gray-50 !font-normal"
                      } transition-colors max-md:px-3 max-md:py-1.5 max-md:text-xs max-md:min-h-[36px]`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div
                ref={overviewRef}
                data-section="Overview"
                className="mt-12 text-neutral-900 max-md:mt-10 max-md:mr-2.5 max-md:max-w-full"
              >
                <article className="w-full max-md:max-w-full">
                  <h2 className="text-3xl font-bold max-md:max-w-full">What you'll learn</h2>
                  <div className="mt-8 w-full text-base leading-6 max-md:max-w-full">
                    {/* Add Overview here */}
                    <p className="mt-5 text-base leading-8 max-md:text-lg max-md:leading-7 mb-6">
                      {displayCourse.overview}
                    </p>
                    <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
                      {displayCourse.learningObjectives.map((objective, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e250ce5e477b6a62341118a96947307c91c70fef?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                            alt="Checkmark"
                            className="object-contain shrink-0 w-6 aspect-square"
                          />
                          <p className="w-[291px]">{objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>

              <div className="border-b border-gray-200 mt-8"></div>

              <div ref={contentRef} data-section="Course Content">
                <CourseDetail
                  sections={displayCourse.sections}
                  requirements={displayCourse.requirements}
                  description={displayCourse.description}
                />
              </div>

              <div ref={detailsRef} data-section="Details">
                {/* Details section content */}
              </div>

              <div className="border-b border-gray-200"></div>

              <div ref={instructorRef} data-section="Instructor">
                <InstructorSection
                  instructor={{
                    name: displayCourse.instructor,
                  }}
                />
              </div>

              {/* <div className="border-b border-gray-200 mt-8"></div> */}

              {/* <div ref={reviewRef} data-section="Review">
                <ReviewSection />
              </div> */}
            </section>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="relative w-[40%] flex-shrink-0 lg:transform lg:-translate-y-1/6 max-[1020px]:w-full max-[1020px]:order-1 max-[1020px]:mt-0 max-[1020px]:mb-8 max-[1020px]:transform-none">
          <div className="grow w-full pt-8 bg-white rounded-3xl border border-slate-200 shadow-[0px_4px_75px_rgba(0,0,0,0.06)] max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-col px-8 max-md:px-5 w-full">
              {/* Course Preview */}
              <div className="relative w-full min-h-[280px] text-xl font-bold text-white rounded-2xl shadow-[0px_4px_75px_rgba(0,0,0,0.06)] overflow-hidden text-center max-md:max-w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80 z-10"></div>
                <img
                  src={displayCourse.imageUrl}
                  alt="Course preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  {/* <Image src="/assets/images/play.png" alt="Play" width={100} height={100} /> */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full backdrop-blur-sm bg-white/10 -m-2"></div>
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all relative">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button className="relative pt-56 pb-6 px-16 max-md:pt-24 max-md:px-5 w-full z-20">
                  Preview this course
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-8 font-extrabold text-center text-neutral-900">
                <span className="text-3xl leading-none">
                  {parseInt(displayCourse.price.toString()).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
                {displayCourse.originalPrice && displayCourse.isDiscounted && (
                  <span className="text-xl leading-tight line-through text-neutral-400 font-semibold">
                    {parseInt(displayCourse.originalPrice.toString()).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                )}
                {displayCourse.isDiscounted && (
                  <span className="px-3 py-1.5 text-base text-black uppercase bg-[#FFCA7E] rounded-lg">
                    {displayCourse.percentageOff}% off
                  </span>
                )}
              </div>

              {/* Course Modes */}
              <div className="mt-8 w-full text-center max-md:max-w-full">
                <div className="text-white font-semibold text-xl space-y-3 max-md:max-w-full">
                  {user.role === "admin" && (
                    <p className="text-sm text-gray-500 mb-4">As an admin, you cannot purchase or own courses</p>
                  )}

                  {user.role === "admin" ? (
                    <button disabled className="w-full min-h-[58px] bg-gray-400 cursor-not-allowed rounded-[58px]">
                      In-Person
                    </button>
                  ) : (
                    <div className="relative group w-full">
                      <button
                        {...(course.inPersonLearning ? { onClick: () => setShowInPersonPopup(true) } : {})}
                        className={`w-full min-h-[58px] rounded-[58px] ${
                          course.inPersonLearning
                            ? "bg-sky-500 hover:bg-sky-600 transition-colors"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!course.inPersonLearning}
                        type="button"
                      >
                        In-Person
                      </button>
                      {!course.inPersonLearning && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                          In-Person mode is not offered for this course
                        </div>
                      )}
                    </div>
                  )}
                  {user.role === "admin" ? (
                    <button disabled className="w-full min-h-[58px] bg-gray-400 cursor-not-allowed rounded-[58px]">
                      E-Learning
                    </button>
                  ) : user.role === "manager" ? (
                    subscription?.isActive ? (
                      <button disabled className="w-full min-h-[58px] bg-gray-400 cursor-not-allowed rounded-[58px]">
                        Already Owned
                      </button>
                    ) : (
                      <div className="relative group w-full">
                        <button
                          onClick={handleSubscriptionRedirect}
                          className={`w-full min-h-[58px] rounded-[58px] bg-primary hover:bg-primary-hover transition-colors ${
                            !course.onlineLearning ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""
                          }`}
                          disabled={!course.onlineLearning}
                          type="button"
                        >
                          Buy Subscription
                        </button>
                        {!course.onlineLearning && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                            E-Learning mode is not offered for this course
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="relative group w-full">
                      <button
                        onClick={() => handleAddToCart(false)}
                        className={`w-full min-h-[58px] rounded-[58px] ${
                          items.some((item) => item._id === course._id) || !course.onlineLearning
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-hover"
                        }`}
                        disabled={items.some((item) => item._id === course._id) || !course.onlineLearning}
                        type="button"
                      >
                        {items.some((item) => item._id === course._id) ? "Already in Cart" : "E-Learning"}
                      </button>
                      {!course.onlineLearning && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 hidden group-hover:block bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                          E-Learning mode is not offered for this course
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-5 text-base font-medium text-neutral-400">30-Day Money-Back Guarantee</p>
              </div>

              {/* Details Table */}
              <div className="flex flex-wrap gap-9 mt-12 text-lg text-neutral-900 w-full max-md:mt-10">
                <div className="overflow-hidden grow shrink-0 basis-0 w-fit max-md:max-w-full">
                  {Object.entries(displayCourse.courseDetails).map(
                    ([label, value], index) =>
                      label !== "certificate" &&
                      label !== "quizzes" && (
                        <div key={label}>
                          <div className="flex justify-between items-center w-full">
                            <span>{toTitleCase(label)}</span>
                            <span className="font-semibold text-right">{value}</span>
                          </div>
                          {index < Object.keys(displayCourse.courseDetails).length - 1 && (
                            <div className="my-3 w-full border-t border-gray-200" />
                          )}
                        </div>
                      )
                  )}
                </div>
                {/* <div className="self-start shrink-0 w-1.5 h-[190px] bg-slate-200 rounded-xl" /> */}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-center px-14 py-9 mt-10 bg-sky-50 max-md:px-5 max-md:max-w-full">
              <div className="text-center text-neutral-900">
                <p className="text-md">For details about the course</p>
                <p className="mt-3.5 text-2xl font-extrabold leading-none">
                  <span className="text-primary">Call Us: </span>
                  <span className="underline">+444 555 667</span>
                </p>
              </div>
              <div className="flex items-center justify-center mt-12 w-[178px] min-h-10 mx-auto max-md:mt-10 gap-1">
                {socialIcons.map(({ Icon, link }, idx) => (
                  <Link href={link}>
                    <Icon
                      key={idx}
                      className="text-[#5e6f76] text-xl"
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "9999px",
                        padding: "12px",
                        width: "40px",
                        height: "45px",
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 lg:px-3 mb-5 ">
        <div className="mx-auto max-w-[1326px] ">
          <hr className="shrink-0 mt-10 h-px   bg-zinc-200 opacity-10 max-md:max-w-full" />
          <h2 className="text-3xl my-5 font-bold max-md:max-w-full px-4 max-[1340px]:mx-4 lg:px-0">See More Courses</h2>

          <CourseSwiper excludeCourseId={course._id} />
        </div>
      </div>
    </>
  );
};

export default CourseDetailPageClient;
