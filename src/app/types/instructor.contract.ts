import { IUser } from "./user.contract";

export interface IInstructor {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInstructorStatics {
  getInstructorByUserId: (userId: string) => Promise<IInstructor | null>;
}

export type InstructorCreatePayloadSubtype = Omit<
  IInstructor,
  "id" | "rating" | "totalStudents" | "totalCourses" | "createdAt" | "updatedAt"
>;

export type InstructorCreatePayload = Pick<
  IUser,
  "firstName" | "lastName" | "email" | "password" | "role" | "profilePicture"
> &
  InstructorCreatePayloadSubtype;

export type InstructorUpdatePayload = Partial<InstructorCreatePayload> & {
  userId: string;
};
