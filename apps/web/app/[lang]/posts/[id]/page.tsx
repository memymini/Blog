import { notFound } from "next/navigation";
import type { Lang } from "@repo/types";
import { listPosts, getPost } from "@/lib/api/posts";
import { PostDetailView } from "@/components/client/PostDetailView";
import { ProfileCard } from "@/components/client/ProfileCard";
import { VALID_LANGS, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const res = await listPosts({ lang: "ko", limit: 1000 });
    const posts = res.data ?? [];
    return posts.flatMap((p) =>
      VALID_LANGS.map((lang) => ({ lang, id: String(p.id) })),
    );
  } catch {
    return [];
  }
}

interface PostPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { lang, id } = await params;
  const post = await getPost(Number(id), lang);
  if (!post) return {};

  const url = `${SITE_URL}/${lang}/posts/${id}`;
  const title = post.translation.title;
  const description = post.translation.excerpt ?? undefined;
  const images = post.cover_url
    ? [{ url: post.cover_url, alt: title }]
    : [];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${SITE_URL}/ko/posts/${id}`,
        en: `${SITE_URL}/en/posts/${id}`,
      },
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.created_at,
      locale: lang === "ko" ? "ko_KR" : "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_url ? [post.cover_url] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { lang, id } = await params;

  if (!VALID_LANGS.includes(lang as Lang)) notFound();

  const post = await getPost(Number(id), lang);
  if (!post) notFound();

  const typedLang = lang as Lang;

  return (
    <div className="min-h-screen bg-warm-50 flex justify-center px-4 py-4">
      <div className="w-full max-w-5xl flex gap-4 items-start">
        {/* Profile sidebar */}
        <div className="hidden md:block w-52 shrink-0 sticky top-4">
          <ProfileCard lang={typedLang} />
        </div>

        {/* Post content */}
        <div className="flex-1 min-w-0 bg-surface shadow-sm overflow-hidden">
          <PostDetailView post={post} lang={typedLang} />
        </div>
      </div>
    </div>
  );
}
