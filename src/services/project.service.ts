import { prisma } from "@/lib/prisma";
import { Project } from "@/types";

// Admin methods
export async function getAllProjectsForAdmin() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects for admin:", error);
    return [];
  }
}

export async function getProjectForAdmin(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    return project;
  } catch (error) {
    console.error("Failed to fetch project for admin:", error);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });

    return projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      tech: project.tech,
      image: project.image || "",
      link: project.link || "#",
      github: project.github || "#",
      period: project.period || "",
      order: project.order,
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return null;
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      tech: project.tech,
      image: project.image || "",
      link: project.link || "#",
      github: project.github || "#",
      period: project.period || "",
      order: project.order,
    };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}
