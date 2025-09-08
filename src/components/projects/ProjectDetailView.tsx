"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Locale, Project } from "@/lib/types";

export default function ProjectDetailView({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const d = project.detail;
  return (
    <div className="mx-auto max-w-5xl px-4 py-28">
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
          ← Back to Projects
        </Link>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm opacity-80">
          {d.period && (
            <span className="px-2 py-1 rounded bg-white/5 border border-[var(--glass-border)]">
              {d.period}
            </span>
          )}
          {d.role?.map((r) => (
            <span
              key={r}
              className="px-2 py-1 rounded bg-white/5 border border-[var(--glass-border)]"
            >
              {r}
            </span>
          ))}
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
            {d.links.map((l) => (
              <a
                key={l.href}
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

      {/* Summary */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p className="opacity-85">{d.summary}</p>
      </motion.section>

      {/* Responsibilities / Architecture */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-2">What I built</h3>
          <ul className="list-disc list-inside opacity-85 space-y-1">
            {d.responsibilities.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </motion.section>

        {d.architecture?.length ? (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-2">Architecture</h3>
            <ul className="list-disc list-inside opacity-85 space-y-1">
              {d.architecture.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </div>

      {/* Challenges & Solutions */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4"
      >
        <h3 className="text-xl font-semibold mb-3">Challenges & Solutions</h3>
        {d.challenges.map((c) => (
          <div className="space-y-4">
            <details key={c.title} className="glass rounded-2xl p-5">
              <summary className="cursor-pointer font-medium list-none">
                <span className="bg-clip-text">{c.title}</span>
              </summary>
              <div className="mt-3 text-sm space-y-2">
                <p>
                  <span className="font-semibold">Problem.</span> {c.problem}
                </p>
                <p>
                  <span className="font-semibold">Solution.</span> {c.solution}
                </p>
                {c.impact && (
                  <p>
                    <span className="font-semibold">Impact.</span> {c.impact}
                  </p>
                )}
              </div>
            </details>
          </div>
        ))}
      </motion.section>

      {/* Gallery */}
      {d.images?.length ? (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-3">Screenshots</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {d.images.map((img) => (
              <div
                key={img.alt}
                className="overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-white/5"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </motion.section>
      ) : null}
    </div>
  );
}
