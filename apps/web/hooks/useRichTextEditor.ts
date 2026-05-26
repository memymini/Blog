"use client";

import { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "tiptap-markdown";
import { TextSelection } from "@tiptap/pm/state";
import { cn } from "@/utils/utils";
import { ImageExtension } from "@/components/admin/editor/ImageExtension";
import { VideoNode } from "@/components/admin/editor/VideoExtension";
import {
  AlignedParagraph,
  AlignedHeading,
  TrailingNode,
} from "@/components/admin/editor/EditorExtensions";

interface UseRichTextEditorOptions {
  value: string;
  onChange: (markdown: string) => void;
}

/**
 * Sets up the Tiptap editor instance with all extensions and keeps it in sync
 * with the controlled `value` prop (e.g. when switching language tabs).
 */
export function useRichTextEditor({ value, onChange }: UseRichTextEditorOptions) {
  const editor = useEditor({
    extensions: [
      // Disable StarterKit's paragraph/heading so our aligned versions take over
      StarterKit.configure({ heading: false, paragraph: false }),
      AlignedParagraph,
      AlignedHeading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExtension,
      VideoNode,
      TrailingNode,
      Markdown.configure({
        html: true, // allow HTML blocks so <img>/<video> tags round-trip correctly
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const md = (editor.storage as any).markdown.getMarkdown() as string;
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
