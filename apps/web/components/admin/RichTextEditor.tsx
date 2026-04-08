"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Heading } from "@tiptap/extension-heading";
import { DOMSerializer } from "@tiptap/pm/model";
import { defaultMarkdownSerializer } from "prosemirror-markdown";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { uploadMediaFile } from "@/lib/api/admin";
import { ResizableImage } from "@/components/admin/ResizableImageExtension";
import { VideoNode } from "@/components/admin/VideoExtension";

// Serializes the inline content of a ProseMirror node to an HTML string.
// Used so that aligned blocks persist with their formatting (bold, italic, etc.).
function nodeContentToHTML(
  node: Parameters<typeof DOMSerializer.fromSchema>[0] extends never
    ? never
    : any,
): string {
  const serializer = DOMSerializer.fromSchema(node.type.schema);
  const fragment = serializer.serializeFragment(node.content);
  const tmp = document.createElement("div");
  tmp.appendChild(fragment);
  return tmp.innerHTML;
}

// Extends paragraph serialization: aligned paragraphs are stored as
// <p style="text-align:..."> HTML blocks so alignment survives save/reload.
const AlignedParagraph = Paragraph.extend({
  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          const align = node.attrs.textAlign;
          if (align && align !== "left") {
            state.write(
              `<p style="text-align:${align}">${nodeContentToHTML(node)}</p>`,
            );
            state.closeBlock(node);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (defaultMarkdownSerializer.nodes.paragraph as any)(state, node);
          }
        },
        parse: {},
      },
    };
  },
});

// Same treatment for headings (h1–h3).
const AlignedHeading = Heading.extend({
  addStorage() {
    return {
      markdown: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serialize(state: any, node: any) {
          const align = node.attrs.textAlign;
          if (align && align !== "left") {
            const tag = `h${node.attrs.level}`;
            state.write(
              `<${tag} style="text-align:${align}">${nodeContentToHTML(node)}</${tag}>`,
            );
            state.closeBlock(node);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (defaultMarkdownSerializer.nodes.heading as any)(state, node);
          }
        },
        parse: {},
      },
    };
  },
});

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
        // NOTE: ALL images go through <figure> serialization — including the default
        // center/no-width case — so remark always sees a block-level element and never
        // wraps the image in <p>, which was the root cause of double margins.

        // Use <figure> as the wrapper — it is a block-level element in the CommonMark
        // spec, so remark treats it as a block HTML node instead of wrapping it in <p>.
        // Bare <img> is inline HTML and gets wrapped in <p>, causing double margins
        // and broken line breaks around images.
        const containerStyles: string[] = [];
        if (width != null) {
          containerStyles.push(`width:${width}%`);
          // centering/alignment only meaningful when image is narrower than container
          if (align === "center")
            containerStyles.push("margin-left:auto;margin-right:auto");
          else if (align === "right")
            containerStyles.push("margin-left:auto;margin-right:0");
        }

        // data-align / data-width on the inner <img> so parseHTML can restore attrs on reload
        const imgAttrs = `src="${src}" data-align="${align}"${width != null ? ` data-width="${width}"` : ""}`;
        const figureStyle = containerStyles.length
          ? ` style="${containerStyles.join(";")}"`
          : "";
        const htmlTag = `<figure${figureStyle}><img ${imgAttrs}></figure>`;

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

  // Sync external value changes (e.g. switching KO ↔ EN tabs).
  // setContent triggers Tiptap's ReactNodeViewRenderer which calls flushSync internally.
  // Deferring to a macrotask ensures React has finished its current flush before flushSync runs.
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

  // Insert image by URL
  function insertImageUrl() {
    const url = imageUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
    setShowImageUrlInput(false);
  }

  // Insert video by URL
  function insertVideoUrl() {
    const url = videoUrl.trim();
    if (!url || !editor) return;
    editor.chain().focus().setVideo({ src: url }).run();
    setVideoUrl("");
    setShowVideoUrlInput(false);
  }

  // Upload image file → insert URL returned by the media API
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

  // Upload video file → insert as VideoNode
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

  return (
    <div className={cn("relative", className)}>
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-0.5 mb-3 pb-2 border-b border-muted-200">
          {/* Text formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code"
          >
            {"</>"}
          </ToolbarButton>

          <Separator />

          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>

          <Separator />

          {/* Lists & blocks */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <ListBulletIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered list"
          >
            <ListOrderedIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <QuoteIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block"
          >
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
            onClick={() => {
              setShowImageUrlInput((v) => !v);
              setShowVideoUrlInput(false);
            }}
            active={showImageUrlInput}
            title="Insert image by URL"
          >
            <ImageLinkIcon />
          </ToolbarButton>

          {/* Video — file upload */}
          <ToolbarButton
            onClick={() => videoFileRef.current?.click()}
            active={false}
            disabled={isUploadingVideo}
            title="Insert video from file"
          >
            {isUploadingVideo ? <SpinnerIcon /> : <VideoIcon />}
          </ToolbarButton>

          {/* Video — by URL */}
          <ToolbarButton
            onClick={() => {
              setShowVideoUrlInput((v) => !v);
              setShowImageUrlInput(false);
            }}
            active={showVideoUrlInput}
            title="Insert video by URL"
          >
            <VideoLinkIcon />
          </ToolbarButton>

          <Separator />

          {/* Text alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align left"
          >
            <TextAlignLeftIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align center"
          >
            <TextAlignCenterIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align right"
          >
            <TextAlignRightIcon />
          </ToolbarButton>

          <Separator />

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={false}
            title="Horizontal rule"
          >
            —
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            active={false}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <UndoIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            active={false}
            disabled={!editor.can().redo()}
            title="Redo"
          >
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                insertImageUrl();
              }
            }}
            placeholder="https://example.com/image.jpg"
            autoFocus
            className="flex-1 h-8 px-2 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              insertImageUrl();
            }}
            className="h-8 px-3 text-caption bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => {
              setShowImageUrlInput(false);
              setImageUrl("");
            }}
            className="h-8 px-2 text-caption text-secondary-500 hover:text-primary-900 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Video URL input popover */}
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
            className="flex-1 h-8 px-2 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              insertVideoUrl();
            }}
            className="h-8 px-3 text-caption bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => {
              setShowVideoUrlInput(false);
              setVideoUrl("");
            }}
            className="h-8 px-2 text-caption text-secondary-500 hover:text-primary-900 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
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
      <input
        ref={videoFileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleVideoFile(file);
          e.target.value = "";
        }}
      />

      {/* Placeholder */}
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

function ToolbarButton({
  onClick,
  active,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={cn(
        "flex items-center justify-center w-8 h-8 text-caption rounded-sm transition-colors",
        active
          ? "bg-primary-900 text-white"
          : "text-secondary-500 hover:bg-muted-100 hover:text-primary-900",
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ListOrderedIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function ImageLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
      <line x1="15" y1="9" x2="21" y2="3" />
      <polyline points="18 3 21 3 21 6" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" />
    </svg>
  );
}

function TextAlignLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
  );
}

function TextAlignCenterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function TextAlignRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

function VideoLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
      <line x1="8" y1="2" x2="14" y2="2" />
      <polyline points="11 2 11 5" />
    </svg>
  );
}
