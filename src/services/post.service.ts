import { prisma } from "@/lib/prisma";
import { BlogPost } from "@/types";
import dayjs from "dayjs";

// For Admin use (fetches all posts)
export async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch all posts:", error);
    return [];
  }
}

export async function getPostForAdmin(id: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    return post;
  } catch (error) {
    console.error("Failed to fetch post for admin:", error);
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      date: dayjs(post.createdAt).format("MMM D, YYYY"),
      readTime: post.readTime || "5 min read",
      category: post.category || "Uncategorized",
      image:
        post.image ||
        "https://images.unsplash.com/photo-1762503203730-ca33982518af?q=80&w=1080",
      published: post.published,
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return null;
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      date: dayjs(post.createdAt).format("MMM D, YYYY"),
      readTime: post.readTime || "5 min read",
      category: post.category || "Uncategorized",
      image: post.image || "",
      published: post.published,
    };
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}
