"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/context/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";

function DashboardShell({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted-50">
        <div className="w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted-50">
      <AdminHeader />
      <main className="flex-1 mx-auto w-full px-6 py-8" style={{ maxWidth: "var(--max-w-wide)" }}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
