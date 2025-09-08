"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function Section({
  id,
  title,
  children,
}: PropsWithChildren<{ id: string; title: string }>) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold tracking-tight text-balance mb-3"
      >
        {title}
      </motion.h2>
      <div className="h-[2px] w-20 bg-gradient-to-r from-accent to-brand rounded-full mb-8 opacity-70"></div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
