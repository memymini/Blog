import type { Country } from "@repo/types";
import { apiFetch } from "./client";
import { getMockCountries } from "@/__mocks__/mock-posts";
import { USE_MOCK } from "@/lib/constants";

export async function getCountries(): Promise<Country[]> {
  if (USE_MOCK) return getMockCountries();
  // Let errors propagate — an empty country list is never a valid API response.
  return await apiFetch<Country[]>("/countries");
}
