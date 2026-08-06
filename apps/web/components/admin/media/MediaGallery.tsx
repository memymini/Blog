"use client";

import { useEffect, useState } from "react";
import { listUploadedFiles } from "@/services/adminAPI";

interface MediaGalleryProps {
  postId: number;
  onInsert: (url: string) => void;
  onClose: () => void;
}

export function MediaGallery({ postId, onInsert, onClose }: MediaGalleryProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listUploadedFiles(postId)
      .then((items) => {
        if (!cancelled) setUrls(items.map((i) => i.url));
      })
      .catch(() => {
        if (!cancelled) setUrls([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [postId]);

  return (
    <div className="absolute z-20 top-full left-0 mt-1 w-80 bg-white border border-muted-200 rounded-lg shadow-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-body-sm font-medium text-primary-900">
          Post media
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-secondary-400 hover:text-primary-900 text-xs leading-none"
          aria-label="Close gallery"
        >
          ✕
        </button>
      </div>

      {loading && (
        <p className="text-body-xs text-secondary-400 py-4 text-center">
          Loading…
        </p>
      )}

      {!loading && urls.length === 0 && (
        <p className="text-body-xs text-secondary-400 py-4 text-center">
          No images uploaded yet.
        </p>
      )}

      {!loading && urls.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 max-h-60 overflow-y-auto">
          {urls.map((url) => (
            <button
              key={url}
              type="button"
              title="Click to insert"
              onClick={() => {
                onInsert(url);
                onClose();
              }}
              className="aspect-square rounded overflow-hidden border border-muted-200 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
