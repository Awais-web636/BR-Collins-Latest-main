"use client";
import React, { useState } from "react";
import { AddUserIcon } from "./Icons";
import CustomDataTable from "./CustomDataTable";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/utils/axios";
import { IUser } from "@/app/types/user.contract";
import { transformUserType } from "@/app/utils/string-manipulation/transform-user-type";
import { useAppSelector } from "@/app/store/hooks";
import { getRefreshToken, getSubscription, selectUser } from "@/app/store/features/users/userSlice";
import ActionIcons from "@/components/ActionIcons";
import ViewUserModal from "./ViewUserModal";
import { useRouter } from "next/navigation";
import StatusMenu from "./StatusMenu";
import { showToast } from "@/app/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { ISubscription } from "@/app/types/subscription.contract";
import { Users, AlertCircle } from "lucide-react";

const fetchUsers = async (refreshToken: string): Promise<{ data: IUser[] }> => {
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data;
};

const updateUserStatus = async (userId: string, status: "active" | "blocked", refreshToken: string): Promise<void> => {
  await api.patch(
    `/users/${userId}/change-status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );
};

// Function to get user limit based on subscription plan
const getUserLimit = (plan: string | undefined): number => {
  switch (plan) {
    case "organization_10":
      return 10;
    case "organization_20":
      return 20;
    case "organization_50":
      return 50;
    default:
      return 0;
  }
};

const UserTable: React.FC = () => {
  const refreshToken = useAppSelector(getRefreshToken);
  const subscription = useAppSelector(getSubscription) as ISubscription;
  const currentUser = useAppSelector(selectUser) as IUser;
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(refreshToken!),
    select: (data) => data.data,
    enabled: !!refreshToken,
  });

  const handleViewUser = (user: IUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: IUser) => {
    // Navigate to AddUser page with user data as query parameter
    router.push(`/dashboard?item=addUser&edit=true&userId=${user.id}`);
  };

  const handleAddUser = () => {
    if (users && subscription?.isActive && currentUser.role === "manager") {
      const userLimit = getUserLimit(subscription.plan);
      if (users.length >= userLimit) {
        showToast(`User limit of ${userLimit} reached. Please upgrade your plan to add more users.`, "error");
        return;
      }
    }
    router.push(`/dashboard?item=addUser`);
  };

  const handleDeleteUser = (user: IUser) => {
    // TODO: Implement delete user functionality
    console.log("Delete user:", user);
  };

  const handleToggleStatus = async (user: IUser, newStatus: "active" | "blocked") => {
    try {
      await updateUserStatus(user.id, newStatus, refreshToken!);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      showToast("Failed to update user status", "error");
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row: IUser) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      grow: 1,
      maxWidth: "250px",
      cell: (row: IUser) => (
        <div className="text-base text-left text-neutral-900 truncate" title={`${row.firstName} ${row.lastName}`}>
          {row.firstName} {row.lastName}
          {row.id === currentUser.id && (
            <span className="ml-2 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">You</span>
          )}
        </div>
      ),
    },
    {
      name: "Email Address",
      selector: (row: IUser) => row.email,
      sortable: true,
      grow: 1.5,
      maxWidth: "250px",
      cell: (row: IUser) => (
        <div className="text-base text-left text-neutral-900 truncate" title={row.email}>
          {row.email}
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row: IUser) => row.role,
      sortable: true,
      grow: 1,
      maxWidth: "250px",
      cell: (row: IUser) => <div className="text-base text-left text-neutral-900">{transformUserType(row.role)}</div>,
    },
    {
      name: "Status",
      selector: (row: IUser) => row.status,
      sortable: true,
      grow: 1,
      maxWidth: "250px",
      cell: (row: IUser) => (
        <StatusMenu
          status={row.status}
          onStatusChange={(newStatus) => handleToggleStatus(row, newStatus)}
          disabled={row.id === currentUser.id}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row: IUser) => (
        <ActionIcons
          onView={() => handleViewUser(row)}
          onEdit={() => handleEditUser(row)}
          viewTooltip="View User Details"
          editTooltip={row.id === currentUser.id ? "Cannot edit your own profile" : "Edit User"}
          disabled={{
            view: false,
            edit: row.role === "admin" || row.id === currentUser.id, // Prevent editing admin users and current user
          }}
        />
      ),
      grow: 0.5,
    },
  ];

  return (
    <section className="flex-1 p-2 sm:p-5 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">View Users</h1>
          {subscription?.isActive && currentUser.role === "manager" && (
            <div className="flex items-center gap-2 mt-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {users?.length || 0} / {getUserLimit(subscription.plan)} users
              </span>
              {users && users.length >= getUserLimit(subscription.plan) && (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">User limit reached</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* <button
          onClick={handleAddUser}
          className={`flex gap-2 items-center text-base font-medium text-orange-500 hover:text-orange-600 transition-colors ${
            users && subscription?.isActive && users.length >= getUserLimit(subscription.plan)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={users && subscription?.isActive && users.length >= getUserLimit(subscription.plan)}
        >
          <AddUserIcon className="w-5 h-5" />
          <span>Add New User</span>
        </button> */}
      </div>

      <CustomDataTable
        columns={columns}
        data={users || []}
        isLoading={isLoading}
        error={error}
        noDataMessage="No users found"
      />

      <ViewUserModal user={selectedUser} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
    </section>
  );
};

export default UserTable;
