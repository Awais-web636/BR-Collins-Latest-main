"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddAppointment from "../components/DashboardComponents/AddAppointment";
import AddCourseCategory from "../components/DashboardComponents/AddCourseCategory";
import AddCourseContent from "../components/DashboardComponents/AddCourseContent";
import AddCourses from "../components/DashboardComponents/AddCourseStepper";
import AddInstructor from "../components/DashboardComponents/AddInstructor";
import AddUser from "../components/DashboardComponents/AddUser";
import Appointments from "../components/DashboardComponents/Appointments";
import Breadcrumb from "../components/DashboardComponents/Breadcrumb";
import CourseHistory from "../components/DashboardComponents/CourseHistory";
import DashboardStats from "../components/DashboardComponents/DashboardStats";
import EnrolledCourses from "../components/DashboardComponents/EnrolledCourses";
import ProfileSummary from "../components/DashboardComponents/ProfileSummary";
import Setting from "../components/DashboardComponents/Setting";
import Sidebar from "../components/DashboardComponents/Sidebar";
import Transactions from "../components/DashboardComponents/Transactions";
import ViewCourseCategories from "../components/DashboardComponents/ViewCourseCategories";
import ViewCourseContent from "../components/DashboardComponents/ViewCourseContent";
import ViewCourses from "../components/DashboardComponents/ViewCourses";
import ViewUser from "../components/DashboardComponents/ViewUser";
import SubscriptionDetails from "../components/DashboardComponents/SubscriptionDetails";
import { useAppSelector } from "../store/hooks";
import { selectUser, getSubscription } from "../store/features/users/userSlice";
import Link from "next/link";
import { Crown } from "lucide-react";
import { ISubscription } from "../types/subscription.contract";
import AdminOffDaysManager from "../components/DashboardComponents/AdminOffDaysManager";

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const subscription = useAppSelector(getSubscription) as ISubscription | null;

  useEffect(() => {
    setIsClient(true);
    // Get the active item from URL query parameter
    const item = searchParams.get("item");
    if (item) {
      setActiveItem(item);
    }

    // Check if user is not logged in
    if (!user || Object.keys(user).length === 0) {
      router.push("/login");
      return;
    }

    // Check if user is a manager and doesn't have an organization
    if (user && typeof user === "object" && "role" in user && user.role === "manager" && !user.organization) {
      router.push("/register-organization");
      return;
    }

    // Check if user is a manager and has no active subscription
    if (
      user &&
      typeof user === "object" &&
      "role" in user &&
      user.role === "manager" &&
      (!subscription || !subscription.isActive)
    ) {
      // Set checking user to false after processing
      setIsCheckingUser(false);
      setIsLoading(false);
      return;
    }

    // Set checking user to false after processing
    setIsCheckingUser(false);
    // Set loading to false after processing
    setIsLoading(false);
  }, [searchParams, user, router, subscription]);

  // Show loading page while checking user role and organization
  if (isCheckingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Checking user permissions...</p>
        </div>
      </div>
    );
  }

  const handleItemClick = (item: string) => {
    setIsLoading(true);
    setActiveItem(item);
    // Update URL with query parameter
    router.push(`/dashboard?item=${item}`);
    // Set loading to false after a short delay to ensure smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const renderContent = () => {
    if (isLoading || !isClient) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Show subscription notice for managers without active subscription
    if (
      user &&
      typeof user === "object" &&
      "role" in user &&
      user.role === "manager" &&
      (!subscription || !subscription.isActive)
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Subscription Required</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            As an organization manager, you need an active subscription to access the dashboard. Please subscribe to
            continue.
          </p>
          <Link
            href="/subscriptions"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            View Subscription Plans
          </Link>
        </div>
      );
    }

    switch (activeItem) {
      case "dashboard":
        return <DashboardStats />;
      case "subscription":
        return <SubscriptionDetails />;
      case "addCourseCategory":
        return <AddCourseCategory />;
      case "viewCourseCategory":
        return <ViewCourseCategories />;
      case "courses":
        return <EnrolledCourses />;
      case "addUser":
        return <AddUser />;
      case "addCourse":
        return <AddCourses />;
      case "viewCourses":
        return <ViewCourses />;
      case "viewUsers":
        return <ViewUser />;
      case "history":
        return <CourseHistory />;
      case "profile":
        return <Setting />;
      case "addInstructor":
        return <AddInstructor />;
      case "addCourseContent":
        return <AddCourseContent />;
      case "viewCourseContent":
        return <ViewCourseContent />;
      case "transactions":
        return <Transactions />;
      case "appointments":
        return <Appointments />;
      case "addAppointment":
        return <AddAppointment />;
      case "adminOffDays":
        return <AdminOffDaysManager />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <main className="flex flex-col bg-neutral-100 min-h-screen px-2 sm:px-4">
      {/* <TopBanner /> */}
      {/* <Header /> */}

      <section className="flex flex-col self-center mt-5 w-full max-w-[1326px] max-md:max-w-full">
        <Breadcrumb />

        <article className="flex flex-col pt-6 mt-6 w-full bg-white rounded-3xl max-md:mt-4 max-md:max-w-full px-2 sm:px-6">
          <ProfileSummary onItemClick={handleItemClick} />

          <div className="flex flex-col md:flex-row gap-6 my-6">
            <div className={`shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-full md:w-68"}`}>
              <Sidebar activeItem={activeItem} onItemClick={handleItemClick} onToggle={handleSidebarToggle} />
            </div>

            {/* <div className="hidden md:block w-px bg-slate-200" /> */}

            <div
              className={`flex-1 overflow-auto transition-all duration-300 ${sidebarCollapsed ? " md:w-[calc(100%-20px+44px)]" : "md:w-[calc(100%-256px)]"
                }`}
            >
              {renderContent()}
            </div>
          </div>
        </article>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
