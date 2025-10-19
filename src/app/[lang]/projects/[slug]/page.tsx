// app/[lang]/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
import { Projects } from "@/lib/types";
import { getDictionary } from "@/app/[lang]/dictionaries";

type Props = {
  params: {
    lang: "en" | "ko";
    slug: string;
  };
};

type PageProps = {
  params: Promise<{
    lang: "en" | "ko";
    slug: string;
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams({ params }: Props) {
  const dict = await getDictionary(params.lang);
  const projects = dict.projects as Projects;
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const awaitedParams = await params;
  const dict = await getDictionary(awaitedParams.lang);
  const projects = dict.projects as Projects;
  const project = projects.find((p) => p.slug === awaitedParams.slug);

  if (!project || !project.detail) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}
