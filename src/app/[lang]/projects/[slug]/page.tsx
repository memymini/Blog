// app/[lang]/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
import { Projects } from "@/lib/types";
import { getDictionary } from "../../dictionaries";

type Props = {
  params: {
    lang: "en" | "ko";
    slug: string;
  };
};

// ISR
export const revalidate = 3600; // 1시간

// SSG: 가능한 모든 slug에 대해 페이지 미리 생성
export async function generateStaticParams({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const projects = dict.projects as Projects;
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const projects = dict.projects as Projects;
  const project = projects.find((p) => p.slug === params.slug);

  if (!project || !project.detail) {
    return notFound();
  }

  return <ProjectDetailView project={project} locale={params.lang} />;
}
