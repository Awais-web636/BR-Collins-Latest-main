import React, { Suspense } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
