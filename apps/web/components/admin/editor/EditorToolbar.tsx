"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "@/utils/utils";
import {
  ListBulletIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeBlockIcon,
  ImageIcon,
  ImageLinkIcon,
  VideoIcon,
  VideoLinkIcon,
  AlignIcon,
  UndoIcon,
  RedoIcon,
  SpinnerIcon,
} from "@/components/icons";

interface EditorToolbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: Editor | any;
  isUploadingImage: boolean;
  isUploadingVideo: boolean;
  showImageUrlInput: boolean;
  showVideoUrlInput: boolean;
  onImageFileClick: () => void;
  onVideoFileClick: () => void;
  onToggleImageUrl: () => void;
  onToggleVideoUrl: () => void;
  className?: string;
}

export function EditorToolbar({
  editor,
  isUploadingImage,
  isUploadingVideo,
  showImageUrlInput,
  showVideoUrlInput,
  onImageFileClick,
  onVideoFileClick,
  onToggleImageUrl,
  onToggleVideoUrl,
  className,
}: EditorToolbarProps) {
  return (
    <div className={cn("flex flex-wrap gap-0.5 mb-3 pb-2 border-b border-muted-200", className)}>
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

      {/* Image */}
      <ToolbarButton onClick={onImageFileClick} active={false} disabled={isUploadingImage} title="Insert image from file">
        {isUploadingImage ? <SpinnerIcon /> : <ImageIcon />}
      </ToolbarButton>
      <ToolbarButton onClick={onToggleImageUrl} active={showImageUrlInput} title="Insert image by URL">
        <ImageLinkIcon />
      </ToolbarButton>

      {/* Video */}
      <ToolbarButton onClick={onVideoFileClick} active={false} disabled={isUploadingVideo} title="Insert video from file">
        {isUploadingVideo ? <SpinnerIcon /> : <VideoIcon />}
      </ToolbarButton>
      <ToolbarButton onClick={onToggleVideoUrl} active={showVideoUrlInput} title="Insert video by URL">
        <VideoLinkIcon />
      </ToolbarButton>

      <Separator />

      {/* Text alignment */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
        <AlignIcon align="left" size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
        <AlignIcon align="center" size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
        <AlignIcon align="right" size={14} />
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
  );
}

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
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
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
