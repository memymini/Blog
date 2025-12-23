import { ArrowRight, Github, Linkedin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <GlassCard className="mx-auto w-full max-w-3xl overflow-hidden p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div
            className="h-64 w-full bg-cover bg-center md:h-auto md:w-2/5"
            style={{
              backgroundImage: "url(/images/me.jpeg)",
            }}
          >
            <div className="h-full w-full bg-black/20 backdrop-blur-[1px]" />
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center p-8 md:w-3/5 md:p-12">
            <div className="mb-2 inline-flex w-fit items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Available for hire
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                Minnie.
              </span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              I design and build modern web experiences with a focus on motion,
              aesthetics, and performance.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                View Work
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-transparent px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Read Blog
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 pt-8 border-t border-gray-200/50 dark:border-white/10">
              <a
                href="https://github.com/memymini"
                className="text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                <Github size={20} />
              </a>
              <a
                href="www.linkedin.com/in/minhee0614"
                className="text-gray-400 transition-colors hover:text-blue-600 dark:hover:text-blue-500"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
