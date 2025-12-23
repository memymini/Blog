"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, Github, ArrowUpRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/app/[lang]/provider";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { Project } from "@/types";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl py-10">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {t("projects_title")}
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          {t("projects_desc")}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-8 sm:grid-cols-2"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={fadeInUp}>
            <GlassCard hoverEffect className="group h-full p-0 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/40 text-black dark:text-white"
                      title="View Source"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/40 text-black dark:text-white"
                      title="Visit Site"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="text-gray-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 dark:text-gray-300"
                    size={20}
                  />
                </div>

                {/* Period Display */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={14} />
                  <span>{project.period}</span>
                </div>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tech.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-200"
                      style={{
                        backgroundColor: "#525252",
                        color: "white",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
