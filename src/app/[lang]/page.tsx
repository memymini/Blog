"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Section from "@/components/Section";
import { useRef } from "react";
import SocialLinks from "@/components/home/SocialLinks";
import ProjectSection from "@/components/projects/ProjectSection";
import TechSection from "@/components/home/TechSection";
import { tech } from "@/lib/techs";
import TypewriterLine from "@/components/home/TypewriterLine";
import { useI18n } from "./provider";
import { Job } from "@/lib/types";

export default function Page() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  useTransform(scrollYProgress, [0, 1], [0, -60]);
  useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const line1 = t("hero_title");
  const cps = 6; // 속도(문자/초)

  return (
    <div className="pt-28">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative mx-auto max-w-6xl px-4 py-24 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-6xl md:text-8xl font-bold font-console tracking-tight text-balance"
          >
            <TypewriterLine text={line1} cps={cps} showCaret={false} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-6 text-lg opacity-80 max-w-2xl mx-auto"
          >
            {t("hero_sub")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <a
              href="#projects"
              className="px-4 py-2 rounded-xl glass hover:bg-white/10"
            >
              {t("cta_projects")}
            </a>
          </motion.div>
          <SocialLinks className="mt-12" />
        </motion.div>
      </section>
      <Section id="tech" title={t("tech_title")}>
        <TechSection items={tech} size="lg" showLabel="hover" variant="row" />
      </Section>

      {/* About */}
      <Section id="about" title={t("about_title")}>
        <div className="flex gap-6">
          <div className="md:col-span-2 glass p-6 rounded-2xl">
            <p className="opacity-80">{t("about_p1")}</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm opacity-80">
              {[
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Zustand",
                "Tanstack Query",
              ].map((s) => (
                <li
                  key={s}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="glass p-6 rounded-2xl">
            <h3 className="font-semibold mb-2 bg-gradient-to-r from-accent to-brand bg-clip-text text-transparent">
              {t("highlights")}
            </h3>
            <ul className="list-disc list-inside space-y-1 opacity-80 text-sm">
              <li>{t("highlight_1")}</li>
              <li>{t("highlight_2")}</li>
              <li>{t("highlight_3")}</li>
            </ul>
          </div> */}
        </div>
      </Section>

      {/* Projects */}
      <ProjectSection />

      {/* Experience */}
      <Section id="experience" title={t("experience_title")}>
        <div className="space-y-4">
          {(t("jobs") as Job[]).map((job) => (
            <div key={job.role} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {job.role} • {job.org}
                </h3>
                <span className="text-sm opacity-70">{job.period}</span>
              </div>
              <ul className="list-disc list-inside mt-2 opacity-80 text-sm">
                {job.bullets.map((b: string) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      {/* <Section id="contact" title={t("contact_title")}>
        <div className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <p className="opacity-85">{t("contact_blurb")}</p>
          <div className="flex gap-3">
            <a
              className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-accent to-brand hover:opacity-95 transition-opacity"
              href="minhi0614@gmail.com"
            >
              {t("contact_email")}
            </a>
            <a
              className="px-4 py-2 rounded-xl glass"
              href="https://github.com/memymini"
              target="_blank"
            >
              {t("contact_github")}
            </a>
          </div>
        </div>
      </Section> */}
    </div>
  );
}
