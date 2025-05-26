export interface ICourse {
  id: string;
  _id: string;
  categoryId: string;
  title: string;
  subtitle?: string;
  slug: string;
  noOfLessons: number;
  noOfHours: number;
  startDate: Date;
  noOfStudents: number;
  language: string;
  lastUpdated: Date;
  bestSeller: boolean;
  rating: number;
  price: number;
  discountPrice?: number;
  isDiscounted: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  previewVideoUrl?: string;
  coverImageUrl?: string;
  whatYouWillLearn: string[];
  requirements: string[];
  overview: string;
  description: string;
  instructor: string;
  skillLevel: string;
  noOfQuizzes: number;
  hasCertificate: boolean;
  passPercentage: number;
  inPersonLearning: boolean;
  onlineLearning: boolean;
  status: "active" | "blocked";
}

export interface ICourseMethods {
  getCourseBySlug: (slug: string) => Promise<ICourse>;
}

export type CourseCreatePayload = Omit<ICourse, "id" | "rating" | "noOfStudents">;

export type CourseUpdatePayload = Partial<CourseCreatePayload>;
