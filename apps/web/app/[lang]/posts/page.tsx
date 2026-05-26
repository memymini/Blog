import { notFound } from "next/navigation";
import type { Lang } from "@repo/types";
import { listPosts } from "@/services/blogAPI";
import { getCountries } from "@/services/countryAPI";
import { CountryFilterBar } from "@/components/client/CountryFilterBar";
import { PostList } from "@/components/client/PostList";
import { LanguageToggleNav } from "@/components/client/LanguageToggleNav";
import { ProfileCard } from "@/components/client/ProfileCard";
import { VALID_LANGS } from "@/utils/constants";

export const revalidate = 3600;

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
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  // Ignore malformed country codes (API enforces 2-char alpha-2)
  const safeCountry = country && /^[A-Za-z]{2}$/.test(country) ? country : undefined;

  const [countries, postsResponse] = await Promise.all([
    getCountries(),
    listPosts({ lang: typedLang, country: safeCountry, page, limit: 20 }),
  ]);

  const posts = postsResponse.data ?? [];

  return (
    <div className="min-h-screen bg-warm-50 flex justify-center px-4 py-4">
      <div className="w-full max-w-5xl flex gap-4 items-start">
        {/* Profile sidebar — hidden on mobile, visible on md+ */}
        <div className="hidden md:block w-52 shrink-0 sticky top-4">
          <ProfileCard lang={typedLang} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 bg-surface shadow-sm overflow-hidden">
          {/* Top bar: filter (scrollable) + language toggle */}
          <div className="flex items-center px-4 py-4 gap-3 border-b border-muted-200 w-full">
            <div className="flex-1 min-w-0">
              <CountryFilterBar
                countries={countries}
                currentCountry={safeCountry}
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
