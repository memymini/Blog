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

export default async function PostsPage({
  params,
  searchParams,
}: PostsPageProps) {
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
    <div className="min-h-screen bg-muted-100 flex justify-center">
      {/* Centered white card — full height on desktop, full-width on mobile */}
      <div className="bg-surface min-h-screen max-w-200 w-full">
        {/* Top bar: filter (scrollable) + language toggle */}
        <div className="flex items-center px-4 py-4 gap-3 border-b border-muted-200 w-full">
          <div className="flex-1 min-w-0">
            <CountryFilterBar
              countries={countries}
              currentCountry={country}
              lang={typedLang}
            />
          </div>
          <LanguageToggleNav currentLang={typedLang} />
        </div>

        <div>
          <PostList posts={posts} lang={typedLang} />
        </div>

        {/* Pagination */}
        {postsResponse.meta &&
          postsResponse.meta.total > postsResponse.meta.limit && (
            <Pagination
              meta={postsResponse.meta}
              lang={typedLang}
              country={country}
            />
          )}
      </div>
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
    <nav
      className="flex justify-center gap-3 py-8 border-t border-muted-200"
      aria-label="Pagination"
    >
      {meta.page > 1 && (
        <a
          href={`/${lang}/posts?page=${meta.page - 1}${query}`}
          className="px-4 py-2 text-body-sm border border-muted-300 rounded-sm hover:bg-muted-50 transition-colors"
        >
          ← Previous
        </a>
      )}
      {meta.page < totalPages && (
        <a
          href={`/${lang}/posts?page=${meta.page + 1}${query}`}
          className="px-4 py-2 text-body-sm border border-muted-300 rounded-sm hover:bg-muted-50 transition-colors"
        >
          Next →
        </a>
      )}
    </nav>
  );
}
