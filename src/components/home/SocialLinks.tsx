"use client";

import { Instagram, Linkedin, Github } from "lucide-react";

type Props = { className?: string };

export default function SocialLinks({ className = "" }: Props) {
  const links = [
    {
      href: "https://instagram.com/minhee0_o",
      label: "Instagram",
      Icon: Instagram,
    },
    {
      href: "https://www.linkedin.com/in/minhee-jung-000417348",
      label: "LinkedIn",
      Icon: Linkedin,
    },
    { href: "https://github.com/memymini", label: "GitHub", Icon: Github },
  ];

  return (
    <ul
      className={`flex items-center justify-center gap-8 md:gap-16 ${className}`}
    >
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="
              group relative grid place-items-center size-12 rounded-full
              border border-[var(--glass-border)]
              bg-[color-mix(in_srgb,var(--fg)_5%,transparent)]
              hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]
              text-[var(--fg)]
              transition-all hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
              after:absolute after:inset-0 after:rounded-full
              after:bg-[linear-gradient(120deg,var(--accent),var(--brand))]
              after:opacity-0 group-hover:after:opacity-30 after:transition-opacity
              shadow-[0_12px_24px_-10px_rgba(0,0,0,0.35)]
            "
          >
            <Icon
              className="size-5 opacity-90 group-hover:opacity-100"
              strokeWidth={1.6}
            />
            <span className="sr-only">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
