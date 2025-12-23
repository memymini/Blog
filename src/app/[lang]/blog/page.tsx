import { getBlogPosts } from "@/services/post.service";
import { BlogList } from "@/components/blog/BlogList";

export default async function Blog({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = await getBlogPosts();

  return <BlogList posts={posts} lang={lang || "en"} />;
}
