"use client";

import { useEffect, useState } from "react";
import type { Country } from "@repo/types";
import { getCountries } from "@/lib/api/countries";
import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    getCountries().then(setCountries).catch(() => {});
  }, []);

  return <PostEditor countries={countries} />;
}
