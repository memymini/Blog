/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaView } from "../media/MediaView";

const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (attrs: {
        src: string;
        alt?: string | null;
        title?: string | null;
      }) => ReturnType;
    };
  }
}

/**
 * Block image node. Serializes as standard markdown ![alt](src).
 * Width and alignment are intentionally not persisted — the editor uses
 * pure markdown output (html: false).
 */
export const ImageExtension = Node.create({
  name: "image",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]:not([src^="data:"])' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (attrs: { src: string; alt?: string | null; title?: string | null }) =>
        ({ commands }: any) =>
          commands.insertContent({ type: this.name, attrs }),
    } as any;
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;
          return { src, alt, title };
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaView) as any;
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const { src, alt } = node.attrs as { src: string; alt: string | null };
          if (!src || src.startsWith("data:")) return;
          state.write(`![${alt ?? ""}](${src})`);
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
