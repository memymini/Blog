"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <header className="h-14 border-b border-muted-200 bg-surface px-6 flex items-center justify-between shrink-0">
      <span className="text-body-sm font-semibold text-primary-900">
        Admin
      </span>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-caption text-secondary-500 hidden sm:block">
            {user.email}
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
