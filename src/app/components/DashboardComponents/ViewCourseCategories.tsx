"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AddUserIcon } from "./Icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import CustomDataTable from "./CustomDataTable";
import ActionIcons from "@/components/ActionIcons";
import ViewCourseCategoryModal from "./ViewCourseCategoryModal";
import StatusMenu from "./StatusMenu";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";
import { getRefreshToken } from "@/app/store/features/users/userSlice";
import { showToast } from "@/app/utils/toast";

interface CourseCategory {
  id: string;
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "blocked";
}

const fetchCategories = async (): Promise<{ data: CourseCategory[] }> => {
  const response = await api.get("/course-categories");
  return response.data;
};

export default function ViewCourseCategories() {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const router = useRouter();
  const refreshToken = useAppSelector(getRefreshToken);
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course-categories"],
    queryFn: fetchCategories,
    select: (data) => data.data,
  });

  const handleViewCategory = (category: CourseCategory) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCategory(null);
  };

  const handleEditCategory = (category: CourseCategory) => {
    router.push(`/dashboard?item=addCourseCategory&edit=true&categoryId=${category._id}`);
  };

  const handleDeleteCategory = (category: CourseCategory) => {
    // TODO: Implement delete category functionality
    console.log("Delete category:", category);
  };

  const handleToggleStatus = async (category: CourseCategory, newStatus: "active" | "blocked") => {
    try {
      await api.patch(
        `/course-categories/${category._id}/change-status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["course-categories"] });
    } catch (error) {
      throw new Error("Failed to update category status");
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row: CourseCategory) => row.name,
      sortable: true,
      grow: 1,
      cell: (row: CourseCategory) => <div className="text-base text-left text-neutral-900">{row.name}</div>,
    },
    {
      name: "Description",
      selector: (row: CourseCategory) => row.description,
      sortable: true,
      grow: 2,
      cell: (row: CourseCategory) => <div className="text-base text-left text-neutral-900">{row.description}</div>,
    },
    {
      name: "Status",
      selector: (row: CourseCategory) => row.status,
      sortable: true,
      grow: 1,
      cell: (row: CourseCategory) => (
        <StatusMenu status={row.status} onStatusChange={(newStatus) => handleToggleStatus(row, newStatus)} />
      ),
    },
    {
      name: "Created At",
      selector: (row: CourseCategory) => row.createdAt,
      sortable: true,
      grow: 1,
      cell: (row: CourseCategory) => (
        <div className="text-base text-left text-neutral-900">{new Date(row.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      name: "Actions",
      cell: (row: CourseCategory) => (
        <ActionIcons
          onView={() => handleViewCategory(row)}
          onEdit={() => handleEditCategory(row)}
          viewTooltip="View Category Details"
          editTooltip="Edit Category"
        />
      ),
      grow: 0.5,
    },
  ];

  if (error) {
    showToast("Failed to fetch course categories", "error");
  }

  return (
    <section className="flex-1 p-2 sm:p-5 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Course Categories</h1>
        {/* <button
          className="flex gap-2 items-center text-base font-medium text-orange-500 hover:text-orange-600 transition-colors"
          onClick={() => router.push("/dashboard?item=addCourseCategory")}
        >
          <AddUserIcon className="w-5 h-5" />
          <span>Add New Category</span>
        </button> */}
      </div>

      <CustomDataTable
        columns={columns}
        data={categories || []}
        isLoading={isLoading}
        error={error}
        noDataMessage="No course categories found"
      />

      {selectedCategory && (
        <ViewCourseCategoryModal category={selectedCategory} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
      )}
    </section>
  );
}
