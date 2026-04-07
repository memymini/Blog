import { notFound } from "next/navigation";
import type { Lang } from "@repo/types";
import { listPosts, getPost } from "@/lib/api/posts";
import { AdminPostView } from "@/components/public/AdminPostView";

export const revalidate = 3600;

const VALID_LANGS: Lang[] = ["ko", "en"];

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

  const url = `https://memymini.vercel.app/${lang}/posts/${id}`;
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
        ko: `https://memymini.vercel.app/ko/posts/${id}`,
        en: `https://memymini.vercel.app/en/posts/${id}`,
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
    <div className="min-h-screen bg-muted-100 flex justify-center">
      <div className="max-w-200 w-full bg-surface min-h-screen">
        {/* AdminPostView shows edit button only when authenticated (client-side auth check) */}
        <AdminPostView post={post} lang={typedLang} />
      </div>
    </div>
  );
}
