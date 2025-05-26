"use client";
import React from "react";
import Pagination from "./Pagination";

// Course history data
const courseHistoryData = [
  {
    id: "#5478",
    name: "Business & Management",
    date: "April 15, 2025",
    price: "$100.99",
    status: "Success",
  },
  {
    id: "#5478",
    name: "Technology & IT",
    date: "April 12, 2025",
    price: "$200.99",
    status: "Processing",
  },
  {
    id: "#5478",
    name: "Marketing & Sales",
    date: "April 5, 2025",
    price: "$100.99",
    status: "On Hold",
  },
  {
    id: "#5478",
    name: "Personal Development",
    date: "March 27, 2025",
    price: "$200.99",
    status: "Canceled",
  },
  {
    id: "#5478",
    name: "Healthcare & Wellness",
    date: "February 24, 2025",
    price: "$100.99",
    status: "Success",
  },
  {
    id: "#5478",
    name: "Business & Management",
    date: "February 10, 2025",
    price: "$200.99",
    status: "Success",
  },
  {
    id: "#5478",
    name: "Technology & IT",
    date: "February 4, 2025",
    price: "$100.99",
    status: "Canceled",
  },
];

// Status badge component
const StatusBadge = ({
  status,
}: {
  status: "Success" | "Processing" | "Canceled" | "On Hold";
}) => {
  const statusStyles = {
    Success: "text-green-600 bg-emerald-50",
    Processing: "text-sky-500 bg-blue-50",
    "On Hold": "text-orange-500 bg-rose-50",
    Canceled: "text-red-600 bg-rose-100",
  };

  return (
    <span className={`text-sm px-2.5 py-1 rounded-md ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

function CourseHistoryTable() {
  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm h-full">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
        Course History
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-slate-100 rounded-lg text-sm font-medium text-neutral-900">
          <div>Order ID</div>
          <div>Course Name</div>
          <div>Date</div>
          <div>Price</div>
          <div>Status</div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100">
          {courseHistoryData.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-4 py-4 px-4 text-sm text-gray-500"
            >
              <div>{course.id}</div>
              <div>{course.name}</div>
              <div>{course.date}</div>
              <div>{course.price}</div>
              <div>
                <StatusBadge
                  status={
                    course.status as
                      | "Success"
                      | "Processing"
                      | "Canceled"
                      | "On Hold"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination />
      </div>
    </div>
  );
}

export default CourseHistoryTable;
