import { getProjects } from "@/services/project.service";
import { ProjectList } from "@/components/projects/ProjectList";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectList projects={projects} />;
}
