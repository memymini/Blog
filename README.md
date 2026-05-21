# Travel Blog

![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black?logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)

A personal travel archive built for speed, clarity, and genuine connection — documenting journeys across the world in both Korean and English.

**Live Site:** `<!-- Add your deployed URL here -->`
&nbsp;&nbsp;|&nbsp;&nbsp;
**API Docs:** `<!-- Add your deployed API URL here -->/docs`

---

## About This Project

I built this blog because I love traveling. I wanted a space to archive the memories and stories from every country I've explored.

Also, I enjoy connecting with people from diverse backgrounds. So I included a bilingual feature (Korean/English) to share my stories with people around the world.

---

## Screenshots

> Add screenshots here once deployed. Suggested captures:
>
> - Post list page (desktop and mobile)
> - Post detail with cover image and bilingual toggle
> - Admin editor (Tiptap WYSIWYG in action)
> - Country filter bar

`<!-- Screenshot: post list page -->`
`<!-- Screenshot: post detail page -->`
`<!-- Screenshot: admin editor -->`

---

## Tech Stack

| Layer        | Technology                                       |
| ------------ | ------------------------------------------------ |
| Frontend     | Next.js 16.1.5 — App Router, SSG + ISR           |
| Backend      | NestJS 11 — REST API with Swagger                |
| Database     | Supabase (PostgreSQL + Row-Level Security)       |
| Auth         | Supabase JWT + NestJS `AdminGuard`               |
| File Storage | Supabase Storage (`post-images` bucket)          |
| Styling      | Tailwind CSS v4 — custom editorial design system |
| Rich Text    | Tiptap 3 + `tiptap-markdown`                     |
| Monorepo     | Turborepo + pnpm workspaces                      |
| Deployment   | Vercel — separate projects for `web` and `api`   |
| Language     | Strict TypeScript 5.9 end-to-end                 |

---

## Key Features

**For readers:**

- **Bilingual posts (KO / EN)** — every post is written in Korean and English so the same story reaches different audiences; a language toggle is always one click away
- **Country-based filtering** — posts are tagged by destination and filterable by country, making it easy to browse by region
- **Static generation with ISR** — pages are pre-rendered at build time and revalidated hourly for near-instant load times worldwide
- **OpenGraph & SEO** — per-post `og:article` metadata, `hreflang` alternates, Twitter cards, and canonical URLs so posts are shareable and discoverable

**For authoring:**

- **WYSIWYG Tiptap editor** — writes like a word processor, saves as Markdown; supports resizable and alignable inline images, video embedding, text alignment, and syntax-highlighted code blocks
- **Media management** — drag-resize gallery items, upload cover images and media files directly to Supabase Storage
- **Draft / published toggle** — keep posts private until ready; admin-only routes are JWT-protected

**For reliability:**

- **Consistent API envelope** — every endpoint returns `ApiResponse<T>` or `PaginatedResponse<T>` with `success`, `data`, and `error` fields
- **Shared TypeScript types** — a single `packages/types` package is the source of truth for both the frontend and API; no type drift between layers
- **Row-Level Security** — Supabase RLS policies enforce public read on published content and admin-only writes at the database level

---

## Architecture

```
  Browser / Next.js 16 (SSG + ISR)
         |           ^
    REST / JSON      |
         v           |
  NestJS 11 API (Vercel Serverless)
         |           ^
  Supabase JS        |
    +----------------+----------------+
    |                                 |
    v                                 v
  PostgreSQL                  Supabase Storage
  (posts, translations,       (cover images,
   countries, media)           media files)
```

---

## Security

- **Row-Level Security (RLS)** — public users can only read published content; all writes are restricted to admin-role users at the database level
- **JWT Validation + NestJS AdminGuard** — every `/admin/*` route validates the Supabase Bearer JWT and checks `app_metadata.role === 'admin'`
- **Rate Limiting** — not yet implemented; consider adding `@nestjs/throttler` before broad public exposure

---

## Project Structure

```
blog/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/
│   │   │   ├── [lang]/             # Localized public routes (ko / en)
│   │   │   │   ├── posts/          # Post list page (SSG + ISR)
│   │   │   │   └── posts/[id]/     # Post detail page (SSG + ISR)
│   │   │   └── admin/              # Admin section (client-side auth guard)
│   │   │       ├── login/
│   │   │       ├── (dashboard)/    # Post list + AdminShell layout
│   │   │       └── (editor)/       # Full-screen post editor layout
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── editor/         # Tiptap editor, toolbar, extensions
│   │   │   │   ├── media/          # Cover uploader, media manager, drag-resize
│   │   │   │   └── post/           # PostEditor, PostEditorToolbar, TranslationEditor
│   │   │   ├── icons/              # Categorized SVG icon components
│   │   │   ├── public/             # PostList, CountryFilterBar, MarkdownRenderer, ProfileCard
│   │   │   └── ui/                 # Button, Card, LanguageToggle, typography system
│   │   ├── context/auth.tsx        # AuthProvider + useAuth hook (localStorage JWT)
│   │   ├── lib/
│   │   │   ├── api/                # Typed fetch wrappers (posts, countries, admin)
│   │   │   ├── hooks/              # usePostEditor, useRichTextEditor, useResizeDrag
│   │   │   ├── constants.ts        # VALID_LANGS, SITE_URL, USE_MOCK
│   │   │   └── utils.ts            # cn(), formatDate()
│   │   └── __mocks__/mock-posts.ts # Local mock data (USE_MOCK=true)
│   │
│   └── api/                        # NestJS backend
│       └── src/
│           ├── auth/               # AdminGuard (Supabase JWT), AuthController
│           ├── countries/          # GET /countries
│           ├── posts/
│           │   ├── posts.controller.ts        # Public endpoints
│           │   ├── admin-posts.controller.ts  # Admin CRUD
│           │   ├── posts.service.ts
│           │   ├── translations.service.ts
│           │   ├── media.service.ts
│           │   └── dto/
│           ├── common/             # response.util, supabase-error.util, swagger.schemas
│           └── supabase/           # SupabaseService (anon + service-role clients)
│
├── packages/
│   ├── types/index.ts              # Single source of truth for all shared TypeScript types
│   ├── ui/                         # Shared React primitives
│   ├── eslint-config/
│   └── typescript-config/
│
├── docs/
│   └── ADMIN_GUIDE.md              # Admin role setup and account management
│
└── prisma/schema.prisma            # Prisma schema (mirrors Supabase DB)
```

---

## Database Schema

```sql
countries         code PK | name_en | flag_url
posts             id PK | country_code FK | published | cover_url | created_at | updated_at
post_translations post_id FK | lang (composite PK) | title | excerpt | contents (Markdown) | updated_at
post_media        id PK | post_id FK | type | url | alt_text | caption | display_order | width
```

Migrations live in `apps/api/supabase/migrations/` and are applied via the Supabase CLI or the dashboard SQL editor.

---

_This project is for portfolio purposes. Unauthorized security scanning or API stress testing is strictly prohibited._
