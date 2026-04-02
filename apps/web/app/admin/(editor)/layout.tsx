"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function EditorShell({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/admin/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted-100">
        <div className="w-6 h-6 border-2 border-primary-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function EditorLayout({ children }: { children: ReactNode }) {
  return <EditorShell>{children}</EditorShell>;
}
