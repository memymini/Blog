"use client";

import { motion } from "framer-motion";
import Section from "../Section";
import ProjectCard from "@/components/projects/ProjectCard";
import { useI18n } from "@/app/[lang]/provider";
import { useMemo } from "react";
import { Projects } from "@/lib/types"; // adjust path if needed

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 } as const,
  },
};

export default function ProjectSection() {
  const { locale, t } = useI18n();
  const projects = useMemo(() => t("projects") as Projects, [t]);

  return (
    <Section id="projects" title={t("projects_title")}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((p, idx) => (
          <motion.div key={idx} variants={item}>
            <ProjectCard {...p} locale={locale} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
