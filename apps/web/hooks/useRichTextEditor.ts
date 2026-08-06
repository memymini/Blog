"use client";

import { useEffect, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { TextSelection } from "@tiptap/pm/state";
import { cn } from "@/utils/utils";
import { ImageExtension } from "@/components/admin/editor/ImageExtension";
import { VideoNode } from "@/components/admin/editor/VideoExtension";
import { TrailingNode } from "@/components/admin/editor/EditorExtensions";

interface UseRichTextEditorOptions {
  value: string;
  onChange: (markdown: string) => void;
  /** Called with every URL that disappears from the editor in a single update. */
  onImagesRemoved?: (removedUrls: string[]) => void;
}

/** Returns the set of image src URLs present in the editor's current document. */
function getImageUrls(editor: Editor): Set<string> {
  const urls = new Set<string>();
  editor.state.doc.descendants((node) => {
    if (node.type.name === "image" && node.attrs.src) {
      urls.add(node.attrs.src as string);
    }
  });
  return urls;
}

/**
 * Sets up the Tiptap editor instance with all extensions and keeps it in sync
 * with the controlled `value` prop (e.g. when switching language tabs).
 */
export function useRichTextEditor({
  value,
  onChange,
  onImagesRemoved,
}: UseRichTextEditorOptions) {
  // Tracks the set of image URLs present in the editor so we can diff on update.
  const prevImageUrlsRef = useRef<Set<string>>(new Set());
  // Stable ref so the onUpdate closure never captures a stale callback.
  const onImagesRemovedRef = useRef(onImagesRemoved);
  useEffect(() => { onImagesRemovedRef.current = onImagesRemoved; });

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      VideoNode,
      TrailingNode,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const md = (editor.storage as any).markdown.getMarkdown() as string;
      onChange(md);

      // Diff image URLs against the previous snapshot.
      const currentUrls = getImageUrls(editor);
      const removed = [...prevImageUrlsRef.current].filter(
        (url) => !currentUrls.has(url),
      );
      if (removed.length) {
        onImagesRemovedRef.current?.(removed);
      }
      prevImageUrlsRef.current = currentUrls;
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

  // Populate the initial URL snapshot once the editor is ready.
  useEffect(() => {
    if (editor) prevImageUrlsRef.current = getImageUrls(editor);
  }, [editor]);

  // Sync external value changes (e.g. switching KO ↔ EN tabs).
  // Defer to macrotask so React finishes its flush before flushSync runs inside Tiptap.
  // Also reset the image URL snapshot so tab-switch doesn't trigger false deletions.
  useEffect(() => {
    if (!editor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = (editor.storage as any).markdown.getMarkdown() as string;
    if (current === value) return;
    const id = setTimeout(() => {
      editor.commands.setContent(value, { emitUpdate: false });
      // Reset snapshot AFTER content is replaced so the next user edit
      // diffs against the new tab's images, not the old tab's.
      prevImageUrlsRef.current = getImageUrls(editor);
    }, 0);
    return () => clearTimeout(id);
  }, [value, editor]);

  // After inserting a block atom node (image/video), insertContent leaves the cursor
  // as a NodeSelection ON the node — typing into a NodeSelection does nothing.
  // This command advances the cursor to the next text position after the node.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function focusAfterBlock({ tr, dispatch }: { tr: any; dispatch: any }) {
    if (dispatch) {
      const sel = TextSelection.near(tr.doc.resolve(tr.selection.to), 1);
      tr.setSelection(sel);
    }
    return true;
  }

  return { editor, focusAfterBlock };
}
