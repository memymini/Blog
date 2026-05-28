/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaView } from "../media/MediaView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (attrs: { src: string }) => ReturnType;
    };
  }
}

/**
 * Block video node for the rich text editor.
 *
 * Serializes as a raw <video> HTML block. This is the only viable representation
 * since standard Markdown has no video syntax. The public MarkdownRenderer handles
 * it via rehype-raw. Note: with html:false in tiptap-markdown, existing <video>
 * blocks will not be re-parsed when reopening a saved post in the admin editor.
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
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }: any) {
    return ["video", mergeAttributes({ controls: true }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaView) as any;
  },

  addCommands() {
    return {
      setVideo:
        (attrs: { src: string }) =>
        ({ commands }: any) =>
          commands.insertContent({ type: "video", attrs }),
    } as any;
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const src = node.attrs.src as string | null;
          if (!src) return;
          state.write(`<video src="${src}" controls></video>`);
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
