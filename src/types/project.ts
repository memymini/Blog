export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  techStack: string[];
  status: "completed" | "in-progress" | "planned";
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}
