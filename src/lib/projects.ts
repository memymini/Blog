// lib/projects.ts
export type ProjectCardData = {
  slug: string; // /projects/[slug]
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  image?: string; // /public/... 경로
  href?: string; // 외부 링크가 있으면 유지
};

export const projects: ProjectCardData[] = [
  {
    slug: "modudo",
    title: "Modudo",
    tagline: "Todo List Web",
    description:
      "Swipe to wish. Reduce toy waste by matching families who want to exchange toys.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Zustand", "React Query"],
    image: "/images/modudo.png",
  },
  {
    slug: "study-dashboard",
    title: "Study Dashboard",
    tagline: "Goal tracking for study groups",
    description: "Feature-Sliced dashboard with auth, role, and goal tracking.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Zustand", "React Query"],
    //image: "/projects/study-cover.png",
  },
];

export type Challenge = {
  title: string;
  problem: string;
  solution: string;
  impact?: string;
};

export type ProjectDetail = {
  slug: string;
  title: string;
  period?: string;
  role?: string[]; // 역할(개발/디자인/PM 등)
  stack: string[]; // 실제 사용 스택
  links?: { label: string; href: string }[];
  summary: string; // 한 문단 요약
  responsibilities: string[]; // 내가 구현한 것들(불릿)
  architecture?: string[]; // 구조/아키텍처 요약(불릿)
  challenges: Challenge[]; // 문제와 해결
  images?: { src: string; alt: string }[];
};

// slug별 상세 데이터
export const projectDetails: Record<string, ProjectDetail> = {
  wishntoss: {
    slug: "wishntoss",
    title: "wishntoss — Toy exchange app",
    period: "2024.03 — 2024.08",
    role: ["Frontend", "Feature owner"],
    stack: ["Next.js", "TypeScript", "Tailwind", "Zustand", "React Query"],
    links: [
      { label: "Live", href: "https://example.com/wishntoss" },
      { label: "GitHub", href: "https://github.com/your-id/wishntoss" },
    ],
    summary:
      "가정 내 장난감 과잉 문제를 해결하기 위해, 스와이프 기반으로 장난감 교환 상대를 매칭하는 앱을 만들었습니다.",
    responsibilities: [
      "홈/디테일/프로필/채팅 핵심 플로우 UI 개발",
      "Zustand + React Query로 상태/서버 캐시 분리",
      "이미지 업로드/최적화 및 접근성 개선",
    ],
    architecture: [
      "FSD 구조(entities/features/widgets/pages)로 모듈성 확보",
      "React Query로 서버 상태, Zustand로 UX 중심 전역상태 관리",
      "미들웨어로 라우팅 가드/권한 제어",
    ],
    challenges: [
      {
        title: "사이드바 데이터 불일치",
        problem:
          "레이아웃 고정으로 초기 쿼리가 캐시되어, 생성/참여 직후 사이드바가 최신 목록과 달랐음.",
        solution:
          "대시보드 전용 레이아웃로 분리하고, 생성/참여 성공 시 관련 쿼리 키 정확히 invalidate.",
        impact:
          "생성/참여 이후 사이드바 즉시 반영, UX 불만 감소. 쿼리키 설계 가이드 문서화.",
      },
      {
        title: "이미지 업로드 후 UI 반영 지연",
        problem:
          "FileReader 비동기 처리 직후 state가 즉시 반영되지 않아, 썸네일이 가끔 늦게 보임.",
        solution:
          "미리보기는 base64 → 즉시 반영, 서버 업로드는 mutation으로 분리하여 낙관적 업데이트.",
        impact: "체감 응답성 향상, 실패 시 롤백 로직으로 안정성 확보.",
      },
    ],
    images: [
      { src: "/projects/wishntoss-1.png", alt: "wishntoss home" },
      { src: "/projects/wishntoss-2.png", alt: "wishntoss detail" },
    ],
  },

  "study-dashboard": {
    slug: "study-dashboard",
    title: "Study Dashboard — Goals & Roles",
    period: "2025.01 — 2025.03",
    role: ["Frontend", "Infra"],
    stack: ["Next.js", "TypeScript", "Tailwind", "React Query", "Zustand"],
    links: [{ label: "GitHub", href: "https://github.com/your-id/study" }],
    summary:
      "스터디/목표 관리 대시보드. 권한/역할/목표 진행상태를 한 화면에서 관리.",
    responsibilities: [
      "목표 보드/세부/필터/검색 컴포넌트 개발",
      "JWT 인증/미들웨어 가드",
      "CI/CD(GitHub Actions) 구성",
    ],
    architecture: [
      "SSR + CSR 혼합 렌더링",
      "Query Key 규약, invalidate 전략 정립",
    ],
    challenges: [
      {
        title: "쿼리 키 충돌로 인한 캐시 오염",
        problem:
          "여러 목록이 같은 키를 공유해 캐시 충돌 발생. 필터가 바뀌어도 데이터가 유지됨.",
        solution:
          "queryKey 생성 유틸 도입(goalQueryKeys.list(studyId, filters))",
      },
    ],
    images: [{ src: "/projects/study-1.png", alt: "study dashboard" }],
  },
};
