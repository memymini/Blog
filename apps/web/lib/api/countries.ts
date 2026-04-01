import type { Country } from "@repo/types";
import { apiFetch } from "./client";
import { getMockCountries } from "@/lib/mock-data";

const USE_MOCK =
  process.env.USE_MOCK === "true" || process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function getCountries(): Promise<Country[]> {
  if (USE_MOCK) return getMockCountries();
  return apiFetch<Country[]>("/countries");
}
