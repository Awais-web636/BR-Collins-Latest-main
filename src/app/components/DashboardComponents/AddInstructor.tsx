"use client";
import React, { useState } from "react";

export default function AddInstructor() {
  const [instructorData, setInstructorData] = useState<{
    userId: string;
    bio: string;
    expertise: string[];
    isActive: boolean;
  }>({
    userId: "",
    bio: "",
    expertise: [],
    isActive: true,
  });

  const [newExpertise, setNewExpertise] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstructorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setInstructorData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setInstructorData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Print instructor data
      console.log("Instructor Data:", {
        "User ID": instructorData.userId,
        Bio: instructorData.bio,
        Expertise: instructorData.expertise,
        Status: instructorData.isActive ? "Active" : "Inactive",
      });

      setSuccess(true);
      setInstructorData({
        userId: "",
        bio: "",
        expertise: [],
        isActive: true,
      });
    } catch (error) {
      console.error("Error submitting instructor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-neutral-900 mb-8">Add New Instructor</h2>

      {success && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">Instructor added successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-10 max-w-full w-[705px]">
          <div className="grow shrink-0 basis-0 w-fit">
            <label className="text-base text-neutral-900">User ID *</label>
            <p className="mt-1 text-sm text-gray-500">Enter the user ID of the instructor</p>
          </div>
          <div className="grow shrink-0 text-base text-gray-400 basis-0 w-fit">
            <input
              type="text"
              name="userId"
              value={instructorData.userId}
              onChange={handleChange}
              placeholder="Enter user ID"
              className="overflow-hidden gap-1.5 self-stretch px-4 py-3 w-full rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px]"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-10 max-w-full w-[705px]">
          <div className="grow shrink-0 basis-0 w-fit">
            <label className="text-base text-neutral-900">Bio *</label>
            <p className="mt-1 text-sm text-gray-500">Enter a brief bio about the instructor</p>
          </div>
          <div className="grow shrink-0 text-base text-gray-400 basis-0 w-fit">
            <textarea
              name="bio"
              value={instructorData.bio}
              onChange={handleChange}
              placeholder="Enter instructor bio"
              className="overflow-hidden gap-1.5 self-stretch px-4 py-3 w-full rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[100px]"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-10 max-w-full w-[705px]">
          <div className="grow shrink-0 basis-0 w-fit">
            <label className="text-base text-neutral-900">Expertise</label>
            <p className="mt-1 text-sm text-gray-500">Add areas of expertise for the instructor</p>
          </div>
          <div className="grow shrink-0 text-base text-gray-400 basis-0 w-fit">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Enter expertise"
                  className="flex-1 overflow-hidden gap-1.5 self-stretch px-4 py-3 rounded-lg border border-solid bg-slate-100 border-zinc-200 min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleAddExpertise}
                  className="px-4 py-2 text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {instructorData.expertise.map((expertise, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full"
                  >
                    <span>{expertise}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(index)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 max-w-full w-[705px]">
          <div className="grow shrink-0 basis-0 w-fit">
            <label className="text-base text-neutral-900">Status</label>
            <p className="mt-1 text-sm text-gray-500">Set the instructor's active status</p>
          </div>
          <div className="grow shrink-0 text-base text-gray-400 basis-0 w-fit">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={instructorData.isActive}
                onChange={(e) =>
                  setInstructorData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Add Instructor"}
          </button>
        </div>
      </form>
    </div>
  );
}
