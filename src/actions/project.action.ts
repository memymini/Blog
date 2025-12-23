"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectSchema } from "@/schemas/project.schema";

export async function createProject(prevState: unknown, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    tech: formData.get("tech"), // String, Zod transforms it to array
    link: formData.get("link"),
    github: formData.get("github"),
    image: formData.get("image"),
    period: formData.get("period"),
    detail: formData.get("detail"),
    order: Number(formData.get("order")) || 0,
  };

  const validatedFields = ProjectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    await prisma.project.create({
      data: {
        title: data.title,
        slug:
          data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "project-" + Date.now(),
        description: data.description,
        tech: data.tech,
        link: data.link || undefined,
        github: data.github || undefined,
        image: data.image || "",
        period: data.period || "",
        detail: data.detail || "{}",
        order: data.order || 0,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "Failed to create project" };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    tech: formData.get("tech"),
    link: formData.get("link"),
    github: formData.get("github"),
    image: formData.get("image"),
    period: formData.get("period"),
    detail: formData.get("detail"),
    order: Number(formData.get("order")) || 0,
  };

  const validatedFields = ProjectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        tech: data.tech,
        link: data.link || undefined,
        github: data.github || undefined,
        image: data.image || "",
        period: data.period || "",
        detail: data.detail || "{}",
        order: data.order || 0,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "Failed to update project" };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/projects/" + id);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
  } catch {
    throw new Error("Failed to delete project");
  }
}
