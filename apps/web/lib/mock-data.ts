import type {
  Country,
  PostListItem,
  PostDetail,
  PaginatedResponse,
  ListPostsQuery,
} from "@repo/types";

// ── Countries ──────────────────────────────────────────────────────────────────

export const MOCK_COUNTRIES: Country[] = [
  { code: "KR", name_en: "South Korea", flag_url: "🇰🇷" },
  { code: "JP", name_en: "Japan", flag_url: "🇯🇵" },
  { code: "FR", name_en: "France", flag_url: "🇫🇷" },
  { code: "TH", name_en: "Thailand", flag_url: "🇹🇭" },
  { code: "NL", name_en: "Netherlands", flag_url: "🇳🇱" },
  { code: "GH", name_en: "Ghana", flag_url: "🇬🇭" },
];

// ── Post Detail Contents ───────────────────────────────────────────────────────

const CONTENTS_KO: Record<number, string> = {
  1: `## 시부야 스크램블 교차로

도쿄에 도착한 첫 날 밤, 무작정 시부야로 향했습니다. 밤 11시가 넘었음에도 교차로는 여전히 수천 명의 사람들로 가득했습니다. 신호가 바뀌는 순간, 모든 방향에서 동시에 사람들이 쏟아져 나와 서로를 비껴가는 광경은 경이롭기까지 했습니다.

스크램블 교차로 옆 스타벅스 2층에 자리를 잡고 아래를 내려다보았습니다. 커피 한 잔을 손에 쥔 채 그 혼돈 속에서도 질서를 찾는 도쿄 사람들을 바라보았습니다.

## 야키토리 골목

시부야역 뒷골목에는 좁은 야키토리 가게들이 늘어서 있습니다. 낡은 노렌(暖簾)이 걸린 가게 안으로 들어가면 연기 냄새와 함께 꼬치 굽는 소리가 반겨줍니다. 닭껍질, 허벅지살, 은행 꼬치를 하나씩 주문했습니다. 차가운 생맥주와 함께라면 더할 나위 없었습니다.

## 다음 날 아침

숙소로 돌아오는 길, 편의점에서 산 삼각김밥과 캔커피로 하루를 마무리했습니다. 도쿄의 밤은 길고, 할 것은 끝없이 많았습니다.`,

  2: `## 아인트호벤 도착

네덜란드 교환학생 생활의 첫 날은 뜻밖의 추위로 시작되었습니다. 9월인데도 바람이 매섭게 불었고, 자전거를 타는 현지 학생들 사이에서 저만 혼자 두꺼운 외투를 입고 있었습니다.

Fontys University of Applied Sciences는 아인트호벤 시내 중심부에 위치해 있습니다. 필립스 본사가 있는 도시답게 디자인과 기술에 대한 자부심이 캠퍼스 곳곳에 배어 있었습니다.

## 수업과 프로젝트

교환학생 기간 동안 UX 디자인과 애자일 프로젝트 관리 수업을 들었습니다. 수업 방식이 한국과 달리 토론과 그룹 프로젝트 중심이었습니다. 처음에는 적극적으로 발언하는 게 어색했지만, 몇 주 지나지 않아 자연스럽게 의견을 내기 시작했습니다.

## 주말 여행

아인트호벤에서 기차로 한 시간이면 암스테르담, 로테르담, 헤이그 등 주요 도시를 모두 갈 수 있습니다. 주말마다 다른 도시를 탐험했고, 벨기에 브뤼헤에도 당일치기로 다녀왔습니다.

## 마치며

6개월간의 교환학생 생활은 제 시야를 넓혀준 소중한 경험이었습니다. 다시 기회가 된다면 꼭 추천하고 싶습니다.`,

  3: `## 파리의 첫 카페

몽파르나스역에서 걸어서 5분, 낡은 아파트 1층에 자리잡은 작은 카페에 들어섰습니다. 대리석 테이블과 등나무 의자, 흑백 사진들이 걸린 벽. 파리의 카페란 이런 것이구나 싶었습니다.

에스프레소 한 잔과 크루아상을 주문했습니다. 크루아상의 겉은 바삭하고 속은 촉촉했습니다. 버터 향이 진하게 퍼졌습니다.

## 센강변 산책

카페에서 나와 센강 쪽으로 걸었습니다. 강변에는 헌책 상인들이 초록색 상자를 펼쳐놓고 있었습니다. 오래된 사진집과 프랑스어 소설들을 훑어보다 얇은 파리 스케치북 하나를 샀습니다.

에펠탑은 생각보다 더 크고, 생각보다 더 아름다웠습니다.`,

  4: `## 왓포 사원

방콕 여행 첫 날, 왓포 사원을 찾았습니다. 46미터 길이의 와불상은 압도적이었습니다. 금빛으로 빛나는 불상의 발바닥에는 108개의 길상 문양이 새겨져 있었습니다.

사원 내부는 이른 아침임에도 관광객들로 붐볐습니다. 하지만 조용한 구석을 찾아 앉아 있으면 종소리와 함께 이상한 평화로움이 찾아왔습니다.

## 카오산 로드

저녁에는 카오산 로드로 향했습니다. 배낭여행자들의 성지라는 별명답게 전 세계에서 온 여행자들이 뒤섞여 있었습니다. 팟타이 한 접시와 싱하 맥주로 방콕의 밤을 즐겼습니다.`,

  5: `## 올레 7코스

제주 올레 7코스는 서귀포 외돌개에서 시작합니다. 제주도의 상징과도 같은 외돌개 앞에서 잠시 멈춰 섰습니다. 홀로 서 있는 바위가 마치 바다를 지키는 파수꾼처럼 느껴졌습니다.

15킬로미터가 넘는 코스를 완주하는 데 약 5시간이 걸렸습니다. 해안 절벽길, 오름 기슭, 귤밭 사이를 걷는 동안 발 아래 제주 바다가 내내 함께했습니다.

## 한라봉과 흑돼지

올레길을 마치고 찾아간 식당에서 흑돼지 구이를 먹었습니다. 제주 흑돼지는 결이 가늘고 풍미가 깊었습니다. 후식으로 나온 한라봉은 달고 향이 강했습니다.`,

  6: `## 기온 거리

교토 기온 거리는 봄에 가장 아름답습니다. 3월 말, 벚꽃이 막 피기 시작할 무렵 찾았습니다. 하나미코지 거리를 걷다가 기모노를 입은 마이코를 마주쳤습니다.

## 철학의 길

철학의 길은 교토에서 가장 좋아하는 산책로입니다. 수로를 따라 벚나무가 줄지어 선 이 길에서, 흩날리는 꽃잎을 맞으며 두 시간을 걸었습니다. 중간에 들른 찻집에서 말차 와라비모치를 먹었습니다.

봄의 교토는 언제나 기대 이상입니다.`,
};

const CONTENTS_EN: Record<number, string> = {
  1: `## Shibuya Scramble Crossing

On my first night in Tokyo, I headed straight to Shibuya. Even past 11 PM, thousands of people filled the crossing. The moment the light changed, people poured from every direction simultaneously—a choreography of controlled chaos.

I found a seat on the second floor of the Starbucks beside the crossing and watched below, coffee in hand. There was something mesmerizing about the way everyone moved without touching.

## Yakitori Alley

Behind Shibuya Station, narrow yakitori stalls line a winding alley. I ducked under a faded noren curtain into a smoke-filled counter, ordered chicken skin, thigh, and ginkgo skewers one by one. Ice-cold draft beer made it perfect.

## The Next Morning

On the walk back, I grabbed an onigiri and canned coffee from the convenience store. Tokyo nights are long and endless.`,

  2: `## Arriving in Eindhoven

My first day as an exchange student started with unexpected cold. Even in September, the wind was sharp. I was the only one in a thick coat while local students cycled past in light jackets.

Fontys University of Applied Sciences sits in the heart of Eindhoven—a city that wears its Philips heritage proudly. Design and technology feel embedded in the campus itself.

## Classes and Projects

I took UX Design and Agile Project Management courses. Unlike Korean universities, classes were built around group discussion and projects. Speaking up felt awkward at first, but within a few weeks I found myself contributing naturally.

## Weekend Trips

From Eindhoven, Amsterdam, Rotterdam, and The Hague are all within an hour by train. I explored a different city most weekends and even did a day trip to Bruges, Belgium.

## Looking Back

Six months of exchange life broadened my perspective in ways I didn't expect. I'd recommend it without hesitation.`,

  3: `## First Café in Paris

Five minutes from Montparnasse station, I stepped into a small café on the ground floor of an old apartment building. Marble tables, wicker chairs, black-and-white photos on the wall. This is what a Paris café is supposed to be.

I ordered an espresso and a croissant. The croissant was crisp outside, soft and buttery within. The scent alone was worth the trip.

## Walking Along the Seine

From the café I walked toward the Seine. Booksellers had opened their green boxes along the riverbank. I browsed old photo books and French novels before buying a thin Paris sketchbook.

The Eiffel Tower was larger than I expected—and more beautiful.`,

  4: `## Wat Pho Temple

On my first day in Bangkok, I visited Wat Pho. The 46-meter reclining Buddha was overwhelming. The soles of its feet are inlaid with 108 auspicious symbols in mother-of-pearl.

Even early in the morning, the temple buzzed with visitors. But sitting in a quiet corner, bells ringing softly, a strange calm settled over me.

## Khao San Road

That evening I walked to Khao San Road—the backpacker mecca. Travelers from every continent mixed together. A plate of pad thai and a cold Singha beer made for a perfect Bangkok night.`,

  5: `## Olle Route 7

Jeju's Olle Route 7 starts at Oedolgae Rock in Seogwipo. I stopped in front of the solitary sea stack, a natural sentinel standing alone against the ocean.

The full course took about five hours to complete—cliff-edge paths, the slopes of volcanic cones, and winding lanes through mandarin orchards, with the Jeju sea always visible below.

## Black Pork and Hallabong

After finishing the trail, I found a small restaurant serving Jeju black pork. The meat was fine-grained and rich. The hallabong citrus served afterward was sweet and fragrant.`,

  6: `## Gion District

Kyoto's Gion district is most beautiful in spring. I arrived at the end of March, just as the cherry blossoms were beginning to open. Walking down Hanamikoji, I passed a maiko in full kimono.

## Philosopher's Path

The Philosopher's Path is my favourite walk in Kyoto—a canal-side lane lined with cherry trees. I walked for two hours through falling petals. Midway, a small tea house served matcha warabi mochi.

Spring in Kyoto always exceeds expectations.`,
};

// ── Raw Post Data ──────────────────────────────────────────────────────────────

interface MockPostData {
  id: number;
  country_code: string;
  cover_url: string;
  created_at: string;
  title_ko: string;
  title_en: string;
  excerpt_ko: string;
  excerpt_en: string;
}

const MOCK_POSTS_DATA: MockPostData[] = [
  {
    id: 1,
    country_code: "JP",
    cover_url: "https://picsum.photos/seed/tokyo/800/450",
    created_at: "2026-02-01T00:00:00Z",
    title_ko: "도쿄 시부야의 밤",
    title_en: "A Night in Shibuya, Tokyo",
    excerpt_ko: "네온사인과 인파로 가득한 도쿄 시부야의 밤을 거닐었습니다.",
    excerpt_en: "Walking through the neon-lit crowds of Shibuya at night.",
  },
  {
    id: 2,
    country_code: "NL",
    cover_url: "https://picsum.photos/seed/fontys/800/450",
    created_at: "2026-02-01T00:00:00Z",
    title_ko: "[Fontys University] 교환학생 후기",
    title_en: "Exchange Student Life at Fontys University",
    excerpt_ko: "네덜란드 아인트호벤에서의 6개월 교환학생 생활을 돌아보며.",
    excerpt_en: "Looking back at six months of exchange life in Eindhoven.",
  },
  {
    id: 3,
    country_code: "FR",
    cover_url: "https://picsum.photos/seed/paris/800/450",
    created_at: "2026-01-15T00:00:00Z",
    title_ko: "파리의 카페에서 보낸 오후",
    title_en: "An Afternoon in a Parisian Café",
    excerpt_ko: "몽파르나스 골목 카페에서 에스프레소와 크루아상을 즐겼습니다.",
    excerpt_en: "Espresso and croissant in a backstreet Montparnasse café.",
  },
  {
    id: 4,
    country_code: "TH",
    cover_url: "https://picsum.photos/seed/bangkok/800/450",
    created_at: "2026-01-10T00:00:00Z",
    title_ko: "방콕 왓포 사원과 카오산 로드",
    title_en: "Bangkok's Wat Pho and Khao San Road",
    excerpt_ko: "방콕 첫날, 와불상과 배낭여행자 거리를 탐험했습니다.",
    excerpt_en: "Day one in Bangkok: the reclining Buddha and the backpacker strip.",
  },
  {
    id: 5,
    country_code: "KR",
    cover_url: "https://picsum.photos/seed/jeju/800/450",
    created_at: "2025-12-20T00:00:00Z",
    title_ko: "제주도 올레길 트레킹",
    title_en: "Hiking the Jeju Olle Trail",
    excerpt_ko: "서귀포 외돌개에서 시작하는 올레 7코스를 완주했습니다.",
    excerpt_en: "Completing Olle Route 7 from Oedolgae Rock in Seogwipo.",
  },
  {
    id: 6,
    country_code: "JP",
    cover_url: "https://picsum.photos/seed/kyoto/800/450",
    created_at: "2025-12-05T00:00:00Z",
    title_ko: "교토에서 만난 봄",
    title_en: "Spring in Kyoto",
    excerpt_ko: "기온 거리와 철학의 길, 벚꽃이 만발한 교토를 걸었습니다.",
    excerpt_en: "Walking through Gion and the Philosopher's Path under cherry blossoms.",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function toPostListItem(d: MockPostData, lang: string): PostListItem {
  const country = MOCK_COUNTRIES.find((c) => c.code === d.country_code)!;
  return {
    id: d.id,
    country_code: d.country_code,
    published: true,
    cover_url: d.cover_url,
    created_at: d.created_at,
    updated_at: d.created_at,
    country,
    translation: {
      post_id: d.id,
      lang: lang === "en" ? "en" : "ko",
      title: lang === "en" ? d.title_en : d.title_ko,
      excerpt: lang === "en" ? d.excerpt_en : d.excerpt_ko,
    },
  };
}

function toPostDetail(d: MockPostData, lang: string): PostDetail {
  const country = MOCK_COUNTRIES.find((c) => c.code === d.country_code)!;
  const isEn = lang === "en";
  return {
    id: d.id,
    country_code: d.country_code,
    published: true,
    cover_url: d.cover_url,
    created_at: d.created_at,
    updated_at: d.created_at,
    country,
    translation: {
      post_id: d.id,
      lang: isEn ? "en" : "ko",
      title: isEn ? d.title_en : d.title_ko,
      excerpt: isEn ? d.excerpt_en : d.excerpt_ko,
      contents: isEn
        ? (CONTENTS_EN[d.id] ?? CONTENTS_KO[d.id] ?? "")
        : (CONTENTS_KO[d.id] ?? ""),
      updated_at: d.created_at,
    },
    media: [],
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function getMockCountries(): Country[] {
  return MOCK_COUNTRIES;
}

export function getMockPosts(query: ListPostsQuery): PaginatedResponse<PostListItem> {
  const { lang, country, page = 1, limit = 20 } = query;

  let filtered = MOCK_POSTS_DATA;
  if (country) {
    filtered = filtered.filter((p) => p.country_code === country.toUpperCase());
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit).map((d) => toPostListItem(d, lang));

  return {
    success: true,
    data: items,
    error: null,
    meta: { total, page, limit },
  };
}

export function getMockPost(id: number, lang: string): PostDetail | null {
  const d = MOCK_POSTS_DATA.find((p) => p.id === id);
  if (!d) return null;
  return toPostDetail(d, lang);
}
