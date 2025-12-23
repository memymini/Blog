"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -5,
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
          : {}
      }
      className={cn(
        "glass overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
