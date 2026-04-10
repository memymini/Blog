"use client";

import { useRef, useState } from "react";
import { EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { uploadMediaFile } from "@/lib/api/admin";
import { EditorToolbar } from "./EditorToolbar";
import { MediaUrlInput } from "./MediaUrlInput";
import { useRichTextEditor } from "@/lib/hooks/useRichTextEditor";

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  /** Pass postId to enable file upload (requires a saved post). Omit for URL-only. */
  postId?: number;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  postId,
  placeholder = "Write here…",
  className,
}: RichTextEditorProps) {
  const imageFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const { editor, focusAfterBlock } = useRichTextEditor({ value, onChange });

  function insertImageUrl() {
    const url = imageUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).command(focusAfterBlock).run();
    setImageUrl("");
    setShowImageUrlInput(false);
  }

  function insertVideoUrl() {
    const url = videoUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setVideo({ src: url }).command(focusAfterBlock).run();
    setVideoUrl("");
    setShowVideoUrlInput(false);
  }

  async function handleImageFile(file: File) {
    if (!editor) return;
    if (!postId) {
      alert("Save the post first, then you can upload images into the content.");
      return;
    }
    setIsUploadingImage(true);
    try {
      const { url } = await uploadMediaFile(postId, file);
      editor.chain().focus().setImage({ src: url }).command(focusAfterBlock).run();
    } catch {
      // silent — user sees nothing inserted
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleVideoFile(file: File) {
    if (!editor) return;
    if (!postId) {
      alert("Save the post first, then you can upload videos into the content.");
      return;
    }
    setIsUploadingVideo(true);
    try {
      const { url } = await uploadMediaFile(postId, file);
      editor.chain().focus().setVideo({ src: url }).command(focusAfterBlock).run();
    } catch {
      // silent
    } finally {
      setIsUploadingVideo(false);
    }
  }

  return (
    <div className={cn("relative", className)}>
      {editor && (
        <EditorToolbar
          editor={editor}
          isUploadingImage={isUploadingImage}
          isUploadingVideo={isUploadingVideo}
          showImageUrlInput={showImageUrlInput}
          showVideoUrlInput={showVideoUrlInput}
          onImageFileClick={() => imageFileRef.current?.click()}
          onVideoFileClick={() => videoFileRef.current?.click()}
          onToggleImageUrl={() => {
            setShowImageUrlInput((v) => !v);
            setShowVideoUrlInput(false);
          }}
          onToggleVideoUrl={() => {
            setShowVideoUrlInput((v) => !v);
            setShowImageUrlInput(false);
          }}
        />
      )}

      {showImageUrlInput && (
        <MediaUrlInput
          value={imageUrl}
          onChange={setImageUrl}
          onInsert={insertImageUrl}
          onCancel={() => { setShowImageUrlInput(false); setImageUrl(""); }}
          placeholder="https://example.com/image.jpg"
        />
      )}

      {showVideoUrlInput && (
        <MediaUrlInput
          value={videoUrl}
          onChange={setVideoUrl}
          onInsert={insertVideoUrl}
          onCancel={() => { setShowVideoUrlInput(false); setVideoUrl(""); }}
          placeholder="https://example.com/video.mp4"
        />
      )}

      <input
        ref={imageFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImageFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={videoFileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleVideoFile(f);
          e.target.value = "";
        }}
      />

      {!editor?.getText() && (
        <p
          className="absolute left-0 text-body-sm text-secondary-300 pointer-events-none select-none"
          style={{
            top: showImageUrlInput || showVideoUrlInput ? "96px" : "56px",
          }}
        >
          {placeholder}
        </p>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
