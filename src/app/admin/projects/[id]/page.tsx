import ProjectEditor from "@/components/admin/ProjectEditor";
import { getProjectForAdmin } from "@/services/project.service";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectForAdmin(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Edit Project
      </h1>
      <ProjectEditor project={project} />
    </div>
  );
}
