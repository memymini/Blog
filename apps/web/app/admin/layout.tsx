"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/auth";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
