"use client";
import { motion } from "framer-motion";

type TimelineItemProps = {
  year: string;
  title: string;
  description: string;
  org: string;
  delay: number;
};

export function TimelineItem({
  year,
  title,
  description,
  org,
  delay,
}: TimelineItemProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        className="absolute -left-4 top-2 w-3 h-3 bg-primary rounded-full"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.4, delay }}
      ></motion.div>
      <h2 className="text-xl font-semibold">
        {year} – {title}, {org}
      </h2>
      <p className="text-md text-gray-600 dark:text-gray-200 mt-1">
        {description}
      </p>
    </motion.div>
  );
}
