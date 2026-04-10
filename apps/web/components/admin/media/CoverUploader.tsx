"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { uploadCover } from "@/lib/api/admin";

interface CoverUploaderProps {
  postId: number;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}

export function CoverUploader({ postId, currentUrl, onUploaded }: CoverUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    try {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      const { url } = await uploadCover(postId, file);
      setPreviewUrl(url);
      onUploaded(url);
    } catch {
      setPreviewUrl(currentUrl);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-label text-secondary-600 mb-2">Cover Image</label>

      {previewUrl ? (
        <div className="relative mb-3">
          <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-muted-200">
            <Image src={previewUrl} alt="Cover preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => { setPreviewUrl(null); onUploaded(""); }}
            className="absolute top-2 right-2 bg-primary-900/70 text-white rounded-sm px-2 py-1 text-label hover:bg-primary-900 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="aspect-[16/9] border-2 border-dashed border-muted-300 rounded-sm flex items-center justify-center cursor-pointer hover:border-muted-400 transition-colors mb-3"
        >
          <span className="text-body-sm text-secondary-400">Click to upload cover image</span>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        loading={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? "Replace" : "Upload"}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
