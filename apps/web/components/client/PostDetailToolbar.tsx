"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Lang } from "@repo/types";
import { LanguageToggleNav } from "@/components/client/LanguageToggleNav";
import { useAuth } from "@/context/auth";
import { BackArrowIcon, EditIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

interface PostDetailToolbarProps {
  postId: number;
  lang: Lang;
}

export function PostDetailToolbar({ postId, lang }: PostDetailToolbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = !!user;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-muted-200">
      <Link
        href={`/${lang}/posts`}
        className="flex items-center gap-1.5 text-body-sm text-secondary-500 hover:text-primary-900 transition-colors"
        aria-label="Back to posts"
      >
        <BackArrowIcon />
      </Link>

      <div className="flex items-center gap-1">
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/posts/${postId}`)}
            aria-label="Edit post"
            className="text-secondary-400 hover:text-primary-900"
          >
            <EditIcon />
          </Button>
        )}
        <LanguageToggleNav currentLang={lang} />
      </div>
    </div>
  );
}
