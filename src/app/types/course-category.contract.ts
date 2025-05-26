export interface ICourseCategory {
  id: string;
  _id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseCategoryCreatePayload = Omit<ICourseCategory, "id">;

export type CourseCategoryUpdatePayload = Partial<CourseCategoryCreatePayload>;
