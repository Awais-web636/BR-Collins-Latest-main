import { UserRole } from "@/app/types/user.contract";

export const transformUserType = (type: UserRole) => {
  switch (type) {
    case "student":
      return "Student";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
  }
};
