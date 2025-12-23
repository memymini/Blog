import { getPostById } from "@/services/post.service";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "ko"; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko"; id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Post not found
      </div>
    );
  }

  return <BlogDetailClient post={post} />;
}
