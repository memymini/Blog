// components/TypewriterLine.tsx
"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  cps?: number; // chars per second (기본 16)
  delay?: number; // 시작 지연(초)
  className?: string;
  showCaret?: boolean; // 커서 표시 여부
};

export default function TypewriterLine({
  text,
  cps = 16,
  delay = 0,
  className,
  showCaret = true,
}: Props) {
  const letters = useMemo(() => Array.from(text), [text]); // 한글/이모지 안전
  const parent = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 1 / cps,
        delayChildren: delay,
      },
    },
  };
  const child = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.01 } }, // 바로 찍힘 느낌
  };

  return (
    <motion.span
      aria-label={text}
      className={cn("inline-flex whitespace-pre", className)}
      variants={parent}
      initial="hidden"
      animate="show"
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={child}
          className="inline-block"
        >
          {ch}
        </motion.span>
      ))}
      {showCaret && (
        <span
          aria-hidden
          className="ml-1 inline-block h-[0.9em] w-[0.08em] bg-current align-[-0.1em] caret-blink"
        />
      )}
    </motion.span>
  );
}
