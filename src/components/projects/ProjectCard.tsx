"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/app/[lang]/provider";

type CardProps = {
  slug?: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  href?: string;
  image?: string;
  locale: "en" | "ko";
};

export default function ProjectCard(p: CardProps) {
  const [hovered, setHovered] = useState(false);
  const internalHref = p.slug ? `/${p.locale}/projects/${p.slug}` : undefined;
  const { t } = useI18n();
  return (
    <motion.article
      className="relative group glass rounded-2xl overflow-hidden transition-transform will-change-transform"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={
        hovered
          ? { rotateX: -1.2, rotateY: 1.2, scale: 1.01 }
          : { rotateX: 0, rotateY: 0, scale: 1 }
      }
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* 1) 스트레치 링크: 카드 전체를 클릭 가능하게 만드는 '단 하나의' 앵커 */}
      {internalHref ? (
        <Link
          href={internalHref}
          className="absolute inset-0 z-10"
          aria-label={`${p.title} details`}
        />
      ) : p.href ? (
        <a
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`${p.title} external`}
        />
      ) : null}

      {/* 2) 외부 링크 버튼 (내부 상세가 있는 경우에만 별도 아이콘 버튼 노출) */}
      {p.slug && p.href && (
        <a
          href={p.href}
          target="_blank"
          rel="noreferrer"
          className="absolute z-20 top-3 right-3 p-2 rounded-xl border border-[var(--glass-border)]
                     bg-[color-mix(in_srgb,var(--fg)_5%,transparent)] hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]"
          onClick={(e) => e.stopPropagation()} // 내부 링크 캡쳐 방지
          aria-label="Open external link"
        >
          <ArrowUpRight size={18} className="opacity-90" />
        </a>
      )}

      {/* 카드 본문 */}
      <div className="relative h-48 w-full bg-white/5">
        {p.image ? (
          <Image src={p.image} alt={p.title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center opacity-60">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{p.title}</h3>
          {/* 화살표 아이콘은 이제 단순 표시 (외부 링크 버튼은 위에 따로 있음) */}
          <ArrowUpRight
            className="opacity-60 group-hover:opacity-100"
            size={18}
          />
        </div>
        <p className="text-sm opacity-80">{p.tagline}</p>
        <p className="text-sm opacity-70">{p.description}</p>
        <ul className="flex flex-wrap gap-2 mt-2">
          {p.tech.map((t) => (
            <li
              key={t}
              className="text-xs px-2 py-1 rounded-full bg-white/5 border border-[var(--glass-border)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
