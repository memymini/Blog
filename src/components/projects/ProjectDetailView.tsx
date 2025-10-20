"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Project, ProjectDetail } from "@/lib/types";
import { useI18n } from "@/app/[lang]/provider";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function ProjectDetailView({ project }: { project: Project }) {
  const { t } = useI18n();
  const d: ProjectDetail = project.detail;
  return (
    <div className="flex min-h-screen h-full w-full flex-col lg:p-20 p-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href="/#projects"
          className="text-sm opacity-80 hover:opacity-100 accent-underline"
        >
          {t("detail_back_to_projects")}
        </Link>
        <h1 className="font-black max-w-9xl lg:text-9xl text-[10vw] text-start">
          {project.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm opacity-80">
          {d.period && (
            <span className="px-2 py-1 rounded bg-white/5 border border-[var(--glass-border)]">
              {d.period}
            </span>
          )}
          {d.role?.map((r, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded bg-white/5 border border-[var(--glass-border)]"
            >
              {r}
            </span>
          ))}
          {d.teams && (
            <span className="px-2 py-1 rounded bg-white/5 border border-[var(--glass-border)]">
              {d.teams}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]"
            >
              {tech}
            </span>
          ))}
        </div>
        {d.links?.length ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {d.links.map((l, idx) => (
              <a
                key={idx}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl text-white bg-[linear-gradient(90deg,var(--accent),var(--brand))] hover:opacity-95 transition-opacity"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="w-full mb-8 flex flex-col 2xl:flex-row gap-6"
      >
        <div className="aspect-video rounded-2xl overflow-hidden border border-[var(--glass-border)] w-full">
          <iframe
            src={d.demo}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="flex flex-col">
          <section id="summary" className="flex flex-col mb-8 gap-4">
            <span className="font-bold text-2xl">
              📝 {t("detail_summary_title")}
            </span>
            <div className="glass p-5 text-md">
              <p>{d.summary}</p>
            </div>
          </section>
          <section id="built" className="flex flex-col gap-4 h-full">
            <span className="font-bold text-2xl">
              🧱 {t("detail_built_title")}
            </span>
            <ul className="glass p-5 flex flex-col gap-2 h-full text-md list-disc list-inside">
              {d.responsibilities.map((r, i) => (
                <li key={i}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <>{children}</>, // p 제거
                    }}
                  >
                    {r}
                  </ReactMarkdown>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.div>
      <section className="flex flex-col mb-8 gap-4">
        <h3 className="text-2xl font-semibold mb-3">
          🧩 {t("detail_challenges_title")}
        </h3>
        {d.challenges.map((c) => (
          <div key={c.title} className="space-y-4">
            <details className="group glass rounded-2xl p-5">
              <summary className="flex justify-between items-center cursor-pointer font-medium list-none">
                <span className="font-bold text-lg">{c.title}</span>
                <ChevronDown className="transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="mt-3 text-md space-y-4 max-w-250 leading-loose">
                <div>
                  <p className="font-black">1️⃣ {t("detail_problem")}</p>
                  <div className="opacity-85">
                    <ReactMarkdown>{c.problem}</ReactMarkdown>
                  </div>
                </div>
                <div>
                  <p className="font-black">2️⃣ {t("detail_cause")}</p>
                  <ul className="list-inside list-disc opacity-85">
                    {c.causes.map((cause, idx) => (
                      <li key={idx}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <>{children}</>, // p 제거
                          }}
                        >
                          {cause}
                        </ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-black">3️⃣ {t("detail_solution")}</p>
                  <ul className="list-inside opacity-85 list-disc">
                    {c.resolution.map((res) => (
                      <li key={res}>
                        {typeof res === "string" && res.startsWith("/") ? (
                          <div className="w-full">
                            <Image
                              src={res}
                              alt="solution image"
                              width={500}
                              height={400}
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                              className="w-full max-w-150 h-auto rounded-lg border border-[var(--glass-border)] object-cover"
                            />
                          </div>
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <>{children}</>, // p 제거
                            }}
                          >
                            {res}
                          </ReactMarkdown>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {c.lessons && c.lessons.length > 0 && (
                  <div>
                    <p className="font-black">4️⃣ {t("detail_lessons")}</p>
                    <ul className="list-inside list-disc opacity-85">
                      {c.lessons.map((lesson, idx) => (
                        <li key={idx}>
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <>{children}</>, // p 제거
                            }}
                          >
                            {lesson}
                          </ReactMarkdown>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div></div>
            </details>
          </div>
        ))}
      </section>
    </div>
  );
}
