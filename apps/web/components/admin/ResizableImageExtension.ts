import { Image } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageView } from "./ResizableImageView";

/**
 * Extends the base Image extension with:
 * - `width`  — percentage (20–100), null means full-width (100%)
 * - `align`  — "left" | "center" | "right"
 *
 * Serialization: when width or non-center align is set, the onUpdate handler
 * in RichTextEditor replaces the `![](url)` markdown with an HTML <img> tag
 * so the attribute survives a save/reload cycle. rehype-raw in MarkdownRenderer
 * renders those <img> tags in the public view.
 */
export const ResizableImage = Image.extend({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          // Accept width="50" or style="width:50%"
          const attr = el.getAttribute("width");
          const style = el.style.width;
          const raw = attr ?? style;
          if (!raw) return null;
          const n = parseFloat(raw);
          return isNaN(n) ? null : n;
        },
        renderHTML: (attrs) =>
          attrs.width != null ? { style: `width:${attrs.width}%;display:block` } : {},
      },
      align: {
        default: "center",
        parseHTML: (el) => {
          const d = el.getAttribute("data-align");
          if (d) return d;
          const ml = el.style.marginLeft;
          const mr = el.style.marginRight;
          if (ml === "auto" && mr === "auto") return "center";
          if (ml === "auto") return "right";
          if (mr === "auto") return "left";
          return "center";
        },
        renderHTML: (attrs) => ({ "data-align": attrs.align }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
