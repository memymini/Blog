"use client";

import { useEffect, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function ToastEditor() {
  const Editor = require("@toast-ui/editor");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const instance = new Editor({
      el: editorRef.current,
      height: "100vh",
      initialEditType: "markdown",
      previewStyle: "vertical",
    });

    return () => instance.destroy();
  }, []);

  return <div id="editor" ref={editorRef} />;
}
