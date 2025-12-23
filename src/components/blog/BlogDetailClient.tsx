"use client";

import { useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const router = useRouter();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div className="mx-auto max-w-3xl pt-6 pb-20">
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white/10 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> Back to Blog
      </button>

      <GlassCard className="overflow-hidden p-0">
        {/* Header Image */}
        <div
          className="h-64 w-full bg-cover bg-center sm:h-80"
          style={{ backgroundImage: `url(${post.image})` }}
        >
          <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="px-6 py-10 sm:px-10">
          {/* Metadata */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200/20 pb-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Calendar size={14} /> {post.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} /> {post.readTime}
            </div>
            <div className="ml-auto flex gap-2">
              {/* <button className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <Share2 size={18} />
              </button>
              <button className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <Bookmark size={18} />
              </button> */}
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-8 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>

          {/* Markdown Content */}
          <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
