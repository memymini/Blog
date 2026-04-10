"use client";

import { useState } from "react";
import Image from "next/image";
import type { PostMedia, CreateMediaPayload } from "@repo/types";
import { Button } from "@/components/ui";
import { addMedia, deleteMedia } from "@/lib/api/admin";

interface MediaManagerProps {
  postId: number;
  media: PostMedia[];
  onChange: (media: PostMedia[]) => void;
}

export function MediaManager({ postId, media, onChange }: MediaManagerProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd() {
    if (!urlInput.trim()) return;
    setIsAdding(true);
    try {
      const payload: CreateMediaPayload = {
        type: "image",
        url: urlInput.trim(),
        display_order: media.length,
      };
      const newItem = await addMedia(postId, payload);
      onChange([...media, newItem]);
      setUrlInput("");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDelete(mediaId: number) {
    await deleteMedia(postId, mediaId);
    onChange(media.filter((m) => m.id !== mediaId));
  }

  return (
    <div>
      <label className="block text-label text-secondary-600 mb-2">Media</label>

      {media.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {media.map((m) => (
            <div key={m.id} className="relative group aspect-square bg-muted-200 rounded-sm overflow-hidden">
              {m.type === "image" && (
                <Image src={m.url} alt={m.alt_text ?? ""} fill className="object-cover" />
              )}
              <button
                type="button"
                onClick={() => handleDelete(m.id)}
                className="absolute inset-0 bg-primary-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-label transition-opacity"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add by URL */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Image URL…"
          className="flex-1 h-9 px-3 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isAdding}
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
