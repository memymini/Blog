"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostSchema } from "@/schemas/post.schema";

export async function createPost(prevState: unknown, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    readTime: formData.get("readTime"),
    image: formData.get("image"),
    published: formData.get("published") === "on",
  };

  const validatedFields = PostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    await prisma.post.create({
      data: {
        ...data,
        readTime: data.readTime || "", // Optional string in schema but Prisma might need string
        image: data.image || "",
        content: data.content || "",
        slug:
          data.slug ||
          data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") ||
          "post-" + Date.now(),
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "Failed to create post" };
  }

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    readTime: formData.get("readTime"),
    image: formData.get("image"),
    published: formData.get("published") === "on",
  };

  const validatedFields = PostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Validation Error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = validatedFields.data;
    await prisma.post.update({
      where: { id },
      data: {
        ...data,
        content: data.content || "",
        readTime: data.readTime || "",
        image: data.image || "",
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "Failed to update post" };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/admin/posts/" + id);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
  } catch {
    throw new Error("Failed to delete post");
  }
}
