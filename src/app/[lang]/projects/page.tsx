import { ProjectCard } from "@/components/projects/ProjectCard";
import { getDictionary } from "../dictionaries";
import { cn } from "@/lib/utils";

export default async function ProjectsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const projects = dict.projects;

  return (
    <div className="flex h-screen w-full flex-col lg:p-16 p-10 lg:gap-8 gap-4">
      <h1
        className={cn(
          "max-w-9xl lg:text-9xl text-[10vw] text-center xl:text-start",
          lang == "en" ? "font-anton" : "font-black"
        )}
      >
        {dict.nav_projects}
      </h1>
      <div className="flex w-full h-full gap-8 overflow-x-auto">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            href={`/${params.lang}/projects/${project.slug}`}
            image={project.image}
            alt={project.title}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}
