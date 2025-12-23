import PostEditor from "@/components/admin/PostEditor";
import { getPostForAdmin } from "@/services/post.service";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostForAdmin(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Edit Post
      </h1>
      <PostEditor post={post} />
    </div>
  );
}
