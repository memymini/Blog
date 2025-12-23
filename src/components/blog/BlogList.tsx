"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/app/[lang]/provider";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { BlogPost } from "@/types";

interface BlogListProps {
  posts: BlogPost[];
  lang: string;
}

export function BlogList({ posts, lang }: BlogListProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {t("blog_title")}
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          {t("blog_desc")}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={fadeInUp}>
            <Link href={`/${lang}/blog/${post.id}`}>
              <GlassCard hoverEffect className="group cursor-pointer p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 w-full md:h-auto md:w-64 shrink-0 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <div className="mb-3 flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </div>
                    </div>

                    <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>

                    <p className="mb-4 text-gray-600 line-clamp-2 dark:text-gray-300">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {t("read_article")}{" "}
                      <ChevronRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
