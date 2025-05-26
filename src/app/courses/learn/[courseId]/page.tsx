import CoursePageClient from "./page.client";

export default async function LearnCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CoursePageClient courseId={courseId} />;
}
