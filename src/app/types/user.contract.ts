import { ENUMS } from "../constants/enum";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordResetAt?: Date;
  role: (typeof ENUMS.USER_TYPES)[number];
  profilePicture?: string;
  status: (typeof ENUMS.USER_STATUS)[number];
  isBlocked: boolean;
  notificationStatus: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  emailVerificationOtp?: string;
  emailVerificationOtpExpiresAt?: Date;
  verified: boolean;
  verifiedAt?: Date;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  hasTwoFactorAuth: boolean;
  allowResetPassword: boolean;
  createdAt: Date;
  updatedAt: Date;
  organization?: string;
}

export interface IUserMethods {
  comparePassword: (password: string) => boolean;
  hashPassword: (password: string) => string;
}

export type UserCreatePayload = Pick<
  IUser,
  "firstName" | "lastName" | "email" | "password" | "role" | "profilePicture"
>;

export type UserUpdatePayload = Omit<
  Partial<UserCreatePayload> & Partial<Pick<IUser, "allowResetPassword" | "profilePicture">>,
  "password" | "otp"
>;

export type ResetPasswordPayload = Pick<IUser, "email">;

export type UserRole = (typeof ENUMS.USER_TYPES)[number];
