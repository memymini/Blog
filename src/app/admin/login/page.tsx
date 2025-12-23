"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth.action";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-950"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Admin Login
        </h1>
        <form action={dispatch} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:text-white"
              id="email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:text-white"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <LoginButton />
          {errorMessage && (
            <div className="text-sm text-red-500">{errorMessage}</div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="mt-4 w-full rounded-md bg-black px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
      aria-disabled={pending}
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  );
}
