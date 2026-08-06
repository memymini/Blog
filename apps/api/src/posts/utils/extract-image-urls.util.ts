const IMAGE_MARKDOWN_RE = /!\[[^\]]*\]\(([^)]+)\)/g;

/** Returns all image src URLs found in a Markdown string. */
export function extractImageUrls(markdown: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(IMAGE_MARKDOWN_RE.source, 'g');
  while ((match = re.exec(markdown)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}
