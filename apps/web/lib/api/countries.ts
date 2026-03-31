import type { Country } from "@repo/types";
import { apiFetch } from "./client";

export async function getCountries(): Promise<Country[]> {
  return apiFetch<Country[]>("/countries");
}
