import { Extension } from "@tiptap/core";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Heading } from "@tiptap/extension-heading";
import { DOMSerializer } from "@tiptap/pm/model";
import { defaultMarkdownSerializer } from "prosemirror-markdown";
import { trailingNode } from "prosemirror-trailing-node";

// Ensures there is always an empty paragraph at the end of the document.
// Without this, block nodes (images, videos) at the end leave the user with
// no place to position the cursor and type.
export const TrailingNode = Extension.create({
  name: "trailingNode",
  addProseMirrorPlugins() {
    return [
      trailingNode({ nodeName: "paragraph", ignoredNodes: ["paragraph"] }),
    ];
  },
});

// Serializes the inline content of a ProseMirror node to an HTML string.
// Used so that aligned blocks persist with their formatting (bold, italic, etc.).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nodeContentToHTML(node: any): string {
  const serializer = DOMSerializer.fromSchema(node.type.schema);
  const fragment = serializer.serializeFragment(node.content);
  const tmp = document.createElement("div");
  tmp.appendChild(fragment);
  return tmp.innerHTML;
}

// Extends paragraph serialization: aligned paragraphs are stored as
// <p style="text-align:..."> HTML blocks so alignment survives save/reload.
export const AlignedParagraph = Paragraph.extend({
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
export const AlignedHeading = Heading.extend({
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
