"use client";

import { useUserStore } from "@/stores/useUserStore";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex items-center justify-center rounded-3xl bg-amber-400 w-9 h-9">
      <img src={user?.profile} />
    </div>
  );
}
