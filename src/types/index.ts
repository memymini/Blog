export type Locale = "en" | "ko";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  published: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  link?: string;
  github?: string;
  period: string;
  order: number;
}
