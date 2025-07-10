"use client";
import ReactMarkdown from "react-markdown";

export default function MdViewer({ content }: { content: string }) {
  return (
    <div>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
