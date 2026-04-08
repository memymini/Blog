/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaView } from "./MediaView";

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

const ALIGN_MARGIN: Record<string, string> = {
  center: "margin-left:auto;margin-right:auto",
  right: "margin-left:auto;margin-right:0",
};

/**
 * Block image node — mirrors VideoNode's schema so both behave identically:
 * atom, selectable, draggable, width + align attributes, own markdown serializer.
 *
 * Serialization:
 *  - plain image (no width/align override) → ![alt](src)
 *  - styled image → <figure style="..."><img src="..." data-align data-width></figure>
 *
 * The <figure> wrapper makes remark treat it as a block element, preventing
 * double margins when rehype-raw renders it in the public MarkdownRenderer.
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
      width: {
        default: null,
        parseHTML: (el) => {
          // Primary: data-width written by this serializer on save
          const dw = el.getAttribute("data-width");
          if (dw) {
            const n = parseFloat(dw);
            return isNaN(n) ? null : n;
          }
          // Legacy fallback: width attr or style="width:X%"
          const raw = el.getAttribute("width") ?? el.style.width;
          if (!raw) return null;
          const n = parseFloat(raw);
          return isNaN(n) ? null : n;
        },
        renderHTML: (attrs) =>
          attrs.width != null
            ? { style: `width:${attrs.width}%;display:block` }
            : {},
      },
      align: {
        default: "center",
        parseHTML: (el) => {
          const d = el.getAttribute("data-align");
          if (d === "left" || d === "center" || d === "right") return d;
          const ml = el.style.marginLeft;
          const mr = el.style.marginRight;
          if (ml === "auto" && mr === "auto") return "center";
          if (ml === "auto") return "right";
          if (mr === "auto" || mr === "0px" || mr === "0") return "left";
          return "center";
        },
        renderHTML: (attrs) => ({ "data-align": attrs.align }),
      },
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
          const { src, alt, width, align } = node.attrs as {
            src: string;
            alt: string | null;
            width: number | null;
            align: string;
          };
          if (!src || src.startsWith("data:")) return;

          if (width != null || (align && align !== "left")) {
            const containerStyles: string[] = [];
            if (width != null) containerStyles.push(`width:${width}%`);
            if (ALIGN_MARGIN[align]) containerStyles.push(ALIGN_MARGIN[align]);
            const imgAttrs = `src="${src}" data-align="${align}"${
              width != null ? ` data-width="${width}"` : ""
            }`;
            const figureStyle = containerStyles.length
              ? ` style="${containerStyles.join(";")}"`
              : "";
            state.write(`<figure${figureStyle}><img ${imgAttrs}></figure>`);
          } else {
            state.write(`![${alt ?? ""}](${src})`);
          }
          state.closeBlock(node);
        },
        parse: {},
      },
    };
  },
});
