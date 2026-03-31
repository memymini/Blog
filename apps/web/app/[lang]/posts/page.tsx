import { notFound } from "next/navigation";
import type { Lang } from "@repo/types";
import { listPosts } from "@/lib/api/posts";
import { getCountries } from "@/lib/api/countries";
import { CountryFilterBar } from "@/components/public/CountryFilterBar";
import { PostList } from "@/components/public/PostList";
import { LanguageToggleNav } from "@/components/public/LanguageToggleNav";

export const revalidate = 3600;

const VALID_LANGS: Lang[] = ["ko", "en"];

export async function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }));
}

interface PostsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ country?: string; page?: string }>;
}

export default async function PostsPage({ params, searchParams }: PostsPageProps) {
  const { lang } = await params;
  const { country, page: pageStr } = await searchParams;

  if (!VALID_LANGS.includes(lang as Lang)) notFound();

  const typedLang = lang as Lang;
  const page = pageStr ? Number(pageStr) : 1;

  const [countries, postsResponse] = await Promise.all([
    getCountries(),
    listPosts({ lang: typedLang, country, page, limit: 20 }),
  ]);

  const posts = postsResponse.data ?? [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-muted-200">
        <div
          className="mx-auto px-4 h-14 flex items-center justify-between"
          style={{ maxWidth: "var(--max-w-wide)" }}
        >
          <span className="text-body-sm font-medium text-primary-900">Travel Blog</span>
          <LanguageToggleNav currentLang={typedLang} />
        </div>
      </header>

      <main
        className="mx-auto px-4 py-8"
        style={{ maxWidth: "var(--max-w-wide)" }}
      >
        {/* Country filter */}
        <div className="mb-6">
          <CountryFilterBar
            countries={countries}
            currentCountry={country}
            lang={typedLang}
          />
        </div>

        {/* Post list */}
        <PostList posts={posts} lang={typedLang} />

        {/* Pagination */}
        {postsResponse.meta && postsResponse.meta.total > postsResponse.meta.limit && (
          <Pagination meta={postsResponse.meta} lang={typedLang} country={country} />
        )}
      </main>
    </div>
  );
}

function Pagination({
  meta,
  lang,
  country,
}: {
  meta: { total: number; page: number; limit: number };
  lang: Lang;
  country?: string;
}) {
  const totalPages = Math.ceil(meta.total / meta.limit);
  const query = country ? `&country=${country}` : "";

  return (
    <nav className="flex justify-center gap-3 mt-10" aria-label="Pagination">
      {meta.page > 1 && (
        <a
          href={`/${lang}/posts?page=${meta.page - 1}${query}`}
          className="px-4 py-2 text-body-sm border border-muted-300 rounded-sm hover:bg-muted-50 transition-colors"
        >
          Previous
        </a>
      )}
      {meta.page < totalPages && (
        <a
          href={`/${lang}/posts?page=${meta.page + 1}${query}`}
          className="px-4 py-2 text-body-sm border border-muted-300 rounded-sm hover:bg-muted-50 transition-colors"
        >
          Next
        </a>
      )}
    </nav>
  );
}
