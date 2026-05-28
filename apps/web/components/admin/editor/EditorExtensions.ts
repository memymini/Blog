import { Extension } from "@tiptap/core";
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
