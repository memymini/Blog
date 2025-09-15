export type TechIconProps = {
  name: string;
  src: string;
  level?: "basic" | "intermediate" | "advanced";
};
export type TechSectionProps = {
  items: TechIconProps[];
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: "always" | "hover" | "none";
  variant?: "row" | "grid";
};

export type Locale = "en" | "ko";

// project types
export type Link = { label: string; href: string };

export type ImageAsset = { src: string; alt: string };

export type Challenge = {
  title: string;
  problem: string;
  causes: string[];
  resolution: string[];
  result?: string;
  lessons?: string[];
};

export type ProjectDetail = {
  period?: string;
  role?: string[];
  teams?: string;
  stack?: string[];
  links?: Link[];
  summary: string;
  responsibilities: string[];
  architecture?: string[];
  challenges: Challenge[];
  images?: ImageAsset[];
};

/** detail 안에서는 slug가 중복이므로 제거, detail은 단일 객체로 */
export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  image?: string;
  href?: string;
  detail: ProjectDetail;
};

export type Projects = Project[];

export type Job = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};
