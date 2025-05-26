import React, { useState, ChangeEvent } from "react";
import { BookOpen, BadgeCheck, UserPlus, Settings, Crown, Camera } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/app/store/hooks";
import { getSubscription, selectUser } from "@/app/store/features/users/userSlice";
import { IUser } from "@/app/types/user.contract";
import { ISubscription } from "@/app/types/subscription.contract";
import CameraIcon from "../../../../public/assets/cameraIcon.svg";

const ProfileSummary = ({ onItemClick }: { onItemClick: (item: string) => void }) => {
  const user = useAppSelector(selectUser) as IUser;
  const subscription = useAppSelector(getSubscription) as ISubscription | null;
  const toTitleCase = (str?: string) => {
    return str?.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCameraClick = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleConfirm = () => {
    // TODO: Add upload logic here
    setIsModalOpen(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <section className="flex flex-col sm:flex-row gap-5 justify-between items-center p-4 sm:p-6 bg-white rounded-xl shadow-sm w-full mx-auto">
        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto">
          {/* Avatar */}
          <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
            <Image
              src={user.profilePicture || "/assets/default-avatar.jpg"}
              width={112}
              height={112}
              alt="Profile Picture"
              className="absolute w-full h-full object-cover rounded-xl"
            />
            <div
              className="w-7 h-7 rounded-full bg-blue-500 absolute top-[10%] -right-[10%] flex justify-center items-center cursor-pointer"
              onClick={handleCameraClick}
            >
              <Image src={CameraIcon} alt="cameraIcon" width={18} height={18} />
            </div>
          </div>

          {/* Details */}
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{`${user.firstName} ${user.lastName}`}</h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 justify-center sm:justify-start">
              <p className="text-sm text-gray-500">{toTitleCase(user.role)}</p>
              {subscription && subscription.isActive && (
                <div className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-2.5 py-1 rounded-full shadow-sm">
                  <Crown className="w-3 h-3" />
                  <span className="font-medium">
                    {subscription.entityType === "user" ? "Individual" : "Organization"} Plan
                  </span>
                  <span className="text-indigo-100">•</span>
                  <span className="text-indigo-100">
                    {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : "Active"}
                  </span>
                </div>
              )}
            </div>

            {/* <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5 mt-3">
              <div className="flex items-center gap-1.5 text-sm">
                <BookOpen className="text-blue-500 w-4 h-4" />
                <span className="text-gray-700">
                  <span className="font-medium text-blue-500">(5)</span> Courses
                </span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-gray-200 my-auto" />

              <div className="flex items-center gap-1.5 text-sm">
                <BadgeCheck className="text-blue-500 w-4 h-4" />
                <span className="text-gray-700">
                  <span className="font-medium text-blue-500">(4)</span> Certificates
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onItemClick("profile")}
          className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-medium text-orange-500 hover:text-orange-600 border border-orange-500 hover:border-orange-600 rounded-full transition-all duration-200 hover:shadow-md whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Settings className="w-4 h-4" />
          <span>My Profile Settings</span>
        </button>
      </section>

      {/* Modal for image upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slideIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full z-10"
              onClick={handleModalClose}
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">Update Profile Picture</h2>
              <div className="flex flex-col items-center gap-4">
                <label className="w-40 h-40 flex flex-col items-center justify-center bg-gray-50 rounded-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 focus-within:border-blue-500 transition relative group shadow-sm">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-blue-400 mb-2 group-hover:text-blue-500 transition" />
                      <span className="text-gray-400 text-xs font-medium text-center select-none">
                        Click or drag to upload
                      </span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                {selectedImage && <p className="text-xs text-gray-500">{selectedImage.name}</p>}
                <div className="flex gap-3 mt-6 w-full">
                  <button
                    className="flex-1 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium border border-gray-200"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                    onClick={handleConfirm}
                    disabled={!previewUrl}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSummary;
