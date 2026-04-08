"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadMediaFile } from "@/lib/api/admin";
import { ResizableImage } from "@/components/admin/ResizableImageExtension";
import { VideoNode } from "@/components/admin/VideoExtension";
import {
  AlignedParagraph,
  AlignedHeading,
} from "@/components/admin/EditorExtensions";
import { EditorToolbar } from "@/components/admin/EditorToolbar";

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

  const editor = useEditor({
    extensions: [
      // Disable StarterKit's paragraph/heading so our aligned versions take over
      StarterKit.configure({ heading: false, paragraph: false }),
      AlignedParagraph,
      AlignedHeading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ResizableImage.configure({ inline: false, allowBase64: false }),
      VideoNode,
      Markdown.configure({
        html: true, // allow HTML blocks so <img> tags round-trip correctly
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let md = (editor.storage as any).markdown.getMarkdown() as string;

      // tiptap-markdown serializes images as ![](url), losing width/align.
      // Walk the doc and replace with <figure> so remark sees a block element
      // (bare <img> is inline HTML and gets wrapped in <p>, causing double margins).
      editor.state.doc.descendants((node) => {
        if (node.type.name !== "image") return true;
        const { src, width, align } = node.attrs as {
          src: string;
          width: number | null;
          align: string;
        };
        if (!src || src.startsWith("data:")) return true;

        const containerStyles: string[] = [];
        if (width != null) {
          containerStyles.push(`width:${width}%`);
          if (align === "center")
            containerStyles.push("margin-left:auto;margin-right:auto");
          else if (align === "right")
            containerStyles.push("margin-left:auto;margin-right:0");
        }

        const imgAttrs = `src="${src}" data-align="${align}"${width != null ? ` data-width="${width}"` : ""}`;
        const figureStyle = containerStyles.length
          ? ` style="${containerStyles.join(";")}"`
          : "";
        const htmlTag = `<figure${figureStyle}><img ${imgAttrs}></figure>`;

        md = md.replace(
          new RegExp(`!\\[[^\\]]*\\]\\(${escapeRegex(src)}(?:\\s[^)]*)?\\)`),
          htmlTag,
        );
        return true;
      });

      onChange(md);
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[480px] focus:outline-none prose max-w-none",
          "text-primary-900 leading-editorial-relaxed",
        ),
      },
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. switching KO ↔ EN tabs).
  // Defer to macrotask so React finishes its flush before flushSync runs inside Tiptap.
  useEffect(() => {
    if (!editor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = (editor.storage as any).markdown.getMarkdown() as string;
    if (current === value) return;
    const id = setTimeout(() => {
      editor.commands.setContent(value, { emitUpdate: false });
    }, 0);
    return () => clearTimeout(id);
  }, [value, editor]);

  function insertImageUrl() {
    const url = imageUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
    setShowImageUrlInput(false);
  }

  function insertVideoUrl() {
    const url = videoUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setVideo({ src: url }).run();
    setVideoUrl("");
    setShowVideoUrlInput(false);
  }

  async function handleImageFile(file: File) {
    if (!editor) return;
    if (!postId) {
      alert(
        "Save the post first, then you can upload images into the content.",
      );
      return;
    }
    setIsUploadingImage(true);
    try {
      const { url } = await uploadMediaFile(postId, file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // silent — user sees nothing inserted
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleVideoFile(file: File) {
    if (!editor) return;
    if (!postId) {
      alert(
        "Save the post first, then you can upload videos into the content.",
      );
      return;
    }
    setIsUploadingVideo(true);
    try {
      const { url } = await uploadMediaFile(postId, file);
      editor.chain().focus().setVideo({ src: url }).run();
    } catch {
      // silent
    } finally {
      setIsUploadingVideo(false);
    }
  }

  const urlInputClass =
    "flex-1 h-8 px-2 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors";
  const insertBtnClass =
    "h-8 px-3 text-caption bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors";
  const cancelBtnClass =
    "h-8 px-2 text-caption text-secondary-500 hover:text-primary-900 transition-colors";

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
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                insertImageUrl();
              }
            }}
            placeholder="https://example.com/image.jpg"
            autoFocus
            className={urlInputClass}
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              insertImageUrl();
            }}
            className={insertBtnClass}
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => {
              setShowImageUrlInput(false);
              setImageUrl("");
            }}
            className={cancelBtnClass}
          >
            ✕
          </button>
        </div>
      )}

      {showVideoUrlInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                insertVideoUrl();
              }
            }}
            placeholder="https://example.com/video.mp4"
            autoFocus
            className={urlInputClass}
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              insertVideoUrl();
            }}
            className={insertBtnClass}
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => {
              setShowVideoUrlInput(false);
              setVideoUrl("");
            }}
            className={cancelBtnClass}
          >
            ✕
          </button>
        </div>
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

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
