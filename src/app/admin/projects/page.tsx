import { deleteProject } from "@/actions/project.action";
import { getAllProjectsForAdmin } from "@/services/project.service";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Tech Stack</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {projects.map((project) => (
              <tr key={project.id} className="group">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {project.order}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {project.title}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {project.tech.slice(0, 3).join(", ")}
                  {project.tech.length > 3 ? "..." : ""}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Edit2
                        size={16}
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      />
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProject(project.id);
                      }}
                    >
                      <button className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Trash2
                          size={16}
                          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No projects found. Create your first project!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
