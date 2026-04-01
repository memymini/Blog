"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadMediaFile } from "@/lib/api/admin";
import { ResizableImage } from "@/components/admin/ResizableImageExtension";

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
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      ResizableImage.configure({ inline: false, allowBase64: false }),
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
      // Walk the doc and replace the markdown syntax with an HTML <img> tag
      // for any image that has custom width or non-center alignment.
      editor.state.doc.descendants((node) => {
        if (node.type.name !== "image") return true;
        const { src, width, align } = node.attrs as {
          src: string;
          width: number | null;
          align: string;
        };
        if (!src) return true; // guard against null/undefined src
        if (src.startsWith("data:")) return true; // data URLs — skip, never in markdown output
        if (width == null && align === "center") return true; // default — keep ![](url)

        const styles: string[] = ["display:block"];
        if (width != null) styles.push(`width:${width}%`);
        if (align === "center") styles.push("margin:0 auto");
        else if (align === "right") styles.push("margin-left:auto");

        const htmlTag = `<img src="${src}" style="${styles.join(";")}">`;
        // Replace first matching markdown image syntax for this src
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

  // Sync external value changes (e.g. switching KO ↔ EN tabs)
  useEffect(() => {
    if (!editor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = (editor.storage as any).markdown.getMarkdown() as string;
    if (current !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Insert image by URL
  function insertImageUrl() {
    const url = imageUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
    setShowImageUrlInput(false);
  }

  // Upload image file → insert URL returned by the media API
  async function handleImageFile(file: File) {
    if (!editor) return;
    if (!postId) {
      // No postId yet — can't upload. Ask the user to save first.
      // (Inserting a base64 data URL would break markdown serialization.)
      alert("Save the post first, then you can upload images into the content.");
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

  return (
    <div className={cn("relative", className)}>
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-0.5 mb-3 pb-2 border-b border-muted-200">
          {/* Text formatting */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
            {"</>"}
          </ToolbarButton>

          <Separator />

          {/* Headings */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
            H3
          </ToolbarButton>

          <Separator />

          {/* Lists & blocks */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <ListBulletIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
            <ListOrderedIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
            <QuoteIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
            <CodeBlockIcon />
          </ToolbarButton>

          <Separator />

          {/* Image — file upload */}
          <ToolbarButton
            onClick={() => imageFileRef.current?.click()}
            active={false}
            disabled={isUploadingImage}
            title="Insert image from file"
          >
            {isUploadingImage ? <SpinnerIcon /> : <ImageIcon />}
          </ToolbarButton>

          {/* Image — by URL */}
          <ToolbarButton
            onClick={() => setShowImageUrlInput((v) => !v)}
            active={showImageUrlInput}
            title="Insert image by URL"
          >
            <ImageLinkIcon />
          </ToolbarButton>

          <Separator />

          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal rule">
            —
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} disabled={!editor.can().undo()} title="Undo">
            <UndoIcon />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} disabled={!editor.can().redo()} title="Redo">
            <RedoIcon />
          </ToolbarButton>
        </div>
      )}

      {/* Image URL input popover */}
      {showImageUrlInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertImageUrl(); } }}
            placeholder="https://example.com/image.jpg"
            autoFocus
            className="flex-1 h-8 px-2 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
          />
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); insertImageUrl(); }}
            className="h-8 px-3 text-caption bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => { setShowImageUrlInput(false); setImageUrl(""); }}
            className="h-8 px-2 text-caption text-secondary-500 hover:text-primary-900 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={imageFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = "";
        }}
      />

      {/* Placeholder */}
      {!editor?.getText() && (
        <p className="absolute left-0 text-body-sm text-secondary-300 pointer-events-none select-none"
          style={{ top: showImageUrlInput ? "96px" : "56px" }}>
          {placeholder}
        </p>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Toolbar helpers
// ---------------------------------------------------------------------------

interface ToolbarButtonProps {
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={cn(
        "flex items-center justify-center w-8 h-8 text-caption rounded-sm transition-colors",
        active ? "bg-primary-900 text-white" : "text-secondary-500 hover:bg-muted-100 hover:text-primary-900",
        disabled && "opacity-30 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-6 bg-muted-200 mx-0.5 self-center" />;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function ListBulletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ListOrderedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function ImageLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      <line x1="15" y1="9" x2="21" y2="3" /><polyline points="18 3 21 3 21 6" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" />
    </svg>
  );
}
