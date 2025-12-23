import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-black p-4">
      <GlassCard className="w-full max-w-md text-center py-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          404
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Return Home
        </Link>
      </GlassCard>
    </div>
  );
}
