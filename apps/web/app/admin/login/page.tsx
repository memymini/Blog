"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/context/auth";
import { ApiError } from "@/lib/api/types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin/posts");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted-100">
      {/* Top-left label matching reference */}
      <p className="px-6 py-5 text-body-sm text-secondary-400">login</p>

      {/* Vertically centered card area */}
      <div className="flex items-start justify-center px-4" style={{ marginTop: "10vh" }}>
        <div className="w-full max-w-sm bg-surface p-8">
          <h1 className="text-h2 font-bold text-primary-900 mb-8">Login</h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-caption text-secondary-500 mb-1"
              >
                id
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-3 bg-muted-200 text-body-sm text-primary-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-caption text-secondary-500 mb-1"
              >
                password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-3 bg-muted-200 text-body-sm text-primary-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            {error && (
              <p role="alert" className="text-caption text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary-900 text-surface text-body-sm font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {isSubmitting ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
