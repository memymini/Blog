/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VideoView } from "./VideoView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (attrs: {
        src: string;
        width?: number | null;
        align?: "left" | "center" | "right" | null;
      }) => ReturnType;
    };
  }
}

const ALIGN_MARGIN: Record<string, string> = {
  left: "margin-right:auto",
  center: "margin-left:auto;margin-right:auto",
  right: "margin-left:auto",
};

/**
 * Block video node for the rich text editor.
 * Supports drag-resize and left/center/right alignment (same UX as ResizableImage).
 * Serializes as <video src="..." controls style="width:XX%;margin:...;display:block"></video>
 * so it round-trips through tiptap-markdown → MarkdownRenderer (rehype-raw).
 */
export const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      align: {
        default: "center",
        parseHTML: (el: HTMLElement) => {
          const ml = el.style.marginLeft;
          const mr = el.style.marginRight;
          if (ml === "auto" && mr === "auto") return "center";
          if (mr === "auto") return "left";
          if (ml === "auto") return "right";
          return "center";
        },
        renderHTML: () => ({}), // handled in width renderHTML below
      },
      width: {
        default: null,
        parseHTML: (el: HTMLElement) => {
          const style = el.style.width;
          if (!style) return null;
          const n = parseFloat(style);
          return isNaN(n) ? null : n;
        },
        renderHTML: (attrs: Record<string, any>) => {
          const parts: string[] = ["display:block"];
          if (attrs.width != null) parts.push(`width:${attrs.width}%`);
          const align = (attrs.align as string) ?? "center";
          if (ALIGN_MARGIN[align]) parts.push(ALIGN_MARGIN[align]);
          return { style: parts.join(";") };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["video", mergeAttributes({ controls: true }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView) as any;
  },

  addCommands() {
    return {
      setVideo:
        (attrs: {
          src: string;
          width?: number | null;
          align?: "left" | "center" | "right" | null;
        }) =>
        ({ commands }: any) =>
          commands.insertContent({ type: "video", attrs }),
    } as any;
  },

  // tiptap-markdown picks up this serializer automatically via extension.storage.markdown
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const src = node.attrs.src as string | null;
          if (!src) return;
          const width = node.attrs.width as number | null;
          const align = (node.attrs.align as string) ?? "center";
          const parts: string[] = ["display:block"];
          if (width != null) parts.push(`width:${width}%`);
          if (ALIGN_MARGIN[align]) parts.push(ALIGN_MARGIN[align]);
          const styleAttr = ` style="${parts.join(";")}"`;
          state.write(`<video src="${src}" controls${styleAttr}></video>`);
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
