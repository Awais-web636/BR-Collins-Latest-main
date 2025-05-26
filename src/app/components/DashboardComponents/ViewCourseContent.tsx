"use client";
import React, { useState } from "react";
import { ViewIcon, EditIcon } from "./Icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { ICourseContent } from "@/app/types/course-content.contract";
import { ICourse } from "@/app/types/course.contract";
import CustomDataTable from "./CustomDataTable";
import ActionIcons from "@/components/ActionIcons";
import ViewCourseContentModal from "./ViewCourseContentModal";
import ContentStatusMenu from "./ContentStatusMenu";
import { useRouter } from "next/navigation";

const fetchCourseContents = async (): Promise<{ data: ICourseContent[] }> => {
  const response = await api.get("/course-contents?populate=courseId");
  return response.data;
};

const toTitleCase = (str?: string) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const toOrdinal = (num: number) => {
  const suffix = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return num + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
};

const ViewCourseContent = () => {
  const [selectedContent, setSelectedContent] = useState<ICourseContent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: contents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course-contents"],
    queryFn: fetchCourseContents,
    select: (data) => data.data,
  });

  const handleView = (content: ICourseContent) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  const handleEdit = (content: ICourseContent) => {
    router.push(`/dashboard?item=addCourseContent&edit=true&contentId=${content._id}`);
  };

  const handleDelete = async (content: ICourseContent) => {
    console.log("Delete content:", content);
    // TODO: Implement delete functionality
  };

  const handleStatusChange = async (contentId: string, status: "active" | "blocked") => {
    try {
      const response = await api.patch(`/course-contents/${contentId}`, {
        status,
      });

      if (response.data) {
        showToast(`Content ${status === "blocked" ? "blocked" : "unblocked"} successfully`, "success");
        queryClient.invalidateQueries({ queryKey: ["course-contents"] });
      }
    } catch (error) {
      showToast("Failed to update content status", "error");
      console.error("Error updating content status:", error);
    }
  };

  const columns = [
    {
      name: "Content Title",
      selector: (row: ICourseContent) => row.title,
      sortable: true,
      grow: 2.5,
      cell: (row: ICourseContent) => (
        <div className="text-base text-left text-neutral-900 truncate" title={row.title}>
          {row.title}
        </div>
      ),
    },
    {
      name: "Course",
      selector: (row: ICourseContent) => (row.courseId as unknown as ICourse)?.title,
      sortable: true,
      grow: 1.5,
      cell: (row: ICourseContent) => (
        <div
          className="text-base text-left text-neutral-900 truncate"
          title={(row.courseId as unknown as ICourse)?.title}
        >
          {(row.courseId as unknown as ICourse)?.title}
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row: ICourseContent) => row.contentType,
      sortable: true,
      grow: 1.5,
      cell: (row: ICourseContent) => (
        <div className="text-base text-left text-neutral-900">{toTitleCase(row.contentType)}</div>
      ),
    },
    {
      name: "Duration",
      selector: (row: ICourseContent) => row.duration,
      sortable: true,
      grow: 1,
      cell: (row: ICourseContent) => {
        const duration = Number(row.duration);
        if (isNaN(duration)) return <div className="text-base text-left text-neutral-900">{row.duration}</div>;

        const minutes = duration;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
          return <div className="text-base text-left text-neutral-900">{`${hours}h ${remainingMinutes}m`}</div>;
        }
        return <div className="text-base text-left text-neutral-900">{`${minutes}m`}</div>;
      },
    },
    {
      name: "Order",
      selector: (row: ICourseContent) => row.order,
      sortable: true,
      grow: 1,
      cell: (row: ICourseContent) => <div className="text-base text-left text-neutral-900">{toOrdinal(row.order)}</div>,
    },
    {
      name: "Status",
      selector: (row: ICourseContent) => row.status,
      sortable: true,
      grow: 1,
      cell: (row: ICourseContent) => (
        <ContentStatusMenu status={row.status} onStatusChange={(status) => handleStatusChange(row._id, status)} />
      ),
    },
    {
      name: "Actions",
      cell: (row: ICourseContent) => <ActionIcons onView={() => handleView(row)} onEdit={() => handleEdit(row)} />,
      grow: 1.5,
    },
  ];

  if (error) {
    showToast("Failed to fetch course contents", "error");
  }

  return (
    <section className="flex-1 p-2 sm:p-5 rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900">View Course Content</h2>
      </div>

      <CustomDataTable
        columns={columns}
        data={contents || []}
        isLoading={isLoading}
        error={error}
        noDataMessage="No course contents found"
      />

      <ViewCourseContentModal
        content={selectedContent}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContent(null);
        }}
      />
    </section>
  );
};

export default ViewCourseContent;
