"use client";

import { TechSectionProps } from "@/lib/types";
import Image from "next/image";
import * as React from "react";
import { Marquee } from "@/components/magicui/marquee";

export default function TechSection({ items }: TechSectionProps) {
  const doubled = [...items, ...items];

  return (
    <Marquee
      className="
      relative overflow-hidden
      [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
    "
    >
      <ul className="flex flex-nowrap gap-5 transform-gpu will-change-transform animate-[marquee_var(--speed)_linear_infinite]">
        {doubled.map((it, idx) => (
          <li
            key={`${it.name}-${idx}`}
            className="flex flex-col items-center p-4 glass justify-between gap-4 min-w-25 w-30"
          >
            <Image src={it.src} alt="" width={50} height={50} />
            <span className="text-xs">{it.name}</span>
          </li>
        ))}
      </ul>
    </Marquee>
  );
}
