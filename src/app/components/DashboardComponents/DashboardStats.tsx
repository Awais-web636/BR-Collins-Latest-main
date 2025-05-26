import React from "react";
import { Book, BookOpen, CheckCircle, Users, Building2, Calendar, Layers, FolderOpen } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { selectUser, getRefreshToken } from "@/app/store/features/users/userSlice";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";

interface StatCardProps {
  icon: React.ReactNode;
  count: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, count, label, bgColor, textColor, borderColor }) => {
  return (
    <div className={`flex flex-col ${bgColor} p-6 rounded-xl w-full`}>
      <div className={`${textColor} text-2xl bg-white p-4 w-fit rounded-xl mb-6 border ${borderColor}`}>{icon}</div>
      <div className={`mt-4 text-6xl font-bold ${textColor}`}>{count}</div>
      <div className="mt-1 text-lg text-neutral-900 font-medium">{label}</div>
    </div>
  );
};

const DashboardStats = () => {
  const user = useAppSelector(selectUser) as any;
  const refreshToken = useAppSelector(getRefreshToken);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get(
        "/dashboard",
        refreshToken ? { headers: { Authorization: `Bearer ${refreshToken}` } } : undefined
      );
      return res.data.data;
    },
    enabled: !!user,
  });

  const isAdmin = user && user.role === "admin";

  return (
    <section className="flex flex-col px-6 py-8 mx-auto max-md:max-w-full">
      <h2 className="self-start text-2xl font-bold text-neutral-900">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-4 mt-5 max-md:max-w-full">
        {isAdmin ? (
          <>
            <StatCard
              icon={<Book className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalCourses ?? 0).toString()}
              label="Total Courses"
              bgColor="bg-blue-50"
              textColor="text-sky-500"
              borderColor="border-blue-500/30"
            />
            <StatCard
              icon={<FolderOpen className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalCourseCategories ?? 0).toString()}
              label="Total Course Categories"
              bgColor="bg-rose-50"
              textColor="text-orange-500"
              borderColor="border-orange-500/30"
            />
            <StatCard
              icon={<Layers className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalCourseContent ?? 0).toString()}
              label="Total Course Content"
              bgColor="bg-emerald-50"
              textColor="text-green-600"
              borderColor="border-green-500/30"
            />
            <StatCard
              icon={<Users className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalUsers ?? 0).toString()}
              label="Total Users"
              bgColor="bg-yellow-50"
              textColor="text-yellow-600"
              borderColor="border-yellow-500/30"
            />
            <StatCard
              icon={<Building2 className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalOrganizations ?? 0).toString()}
              label="Total Organizations"
              bgColor="bg-indigo-50"
              textColor="text-indigo-600"
              borderColor="border-indigo-500/30"
            />
            <StatCard
              icon={<Calendar className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalAppointments ?? 0).toString()}
              label="Total Appointments"
              bgColor="bg-pink-50"
              textColor="text-pink-600"
              borderColor="border-pink-500/30"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={<Book className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalCourses ?? 0).toString()}
              label="Total Courses"
              bgColor="bg-blue-50"
              textColor="text-sky-500"
              borderColor="border-blue-500/30"
            />
            <StatCard
              icon={<BookOpen className="text-2xl" />}
              count={isLoading ? "-" : (data?.totalEnrolledCourses ?? 0).toString()}
              label="Total Enrolled Courses"
              bgColor="bg-rose-50"
              textColor="text-orange-500"
              borderColor="border-orange-500/30"
            />
            <StatCard
              icon={<CheckCircle className="text-2xl" />}
              count={isLoading ? "-" : (data?.completedCourses ?? 0).toString()}
              label="Completed Courses"
              bgColor="bg-emerald-50"
              textColor="text-green-600"
              borderColor="border-green-500/30"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default DashboardStats;
