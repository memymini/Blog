// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}", // (선택) pages 라우터 쓰면 유지
    "./src/**/*.{ts,tsx}", // (선택) src 내부 사용 시
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6b8afd",
          dark: "#516ff0",
        },
        accent: {
          DEFAULT: "#63bfa7", // 톤다운 민트 (너무 튀지 않음)
          dark: "#4aa690",
        },
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
        noise: "url('/noise.png')",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        underline: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        underline: "underline 0.4s ease-out both",
      },
      boxShadow: {
        lift: "0 12px 24px -10px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
