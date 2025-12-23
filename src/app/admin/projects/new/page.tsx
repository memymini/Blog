import ProjectEditor from "@/components/admin/ProjectEditor";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        New Project
      </h1>
      <ProjectEditor />
    </div>
  );
}
