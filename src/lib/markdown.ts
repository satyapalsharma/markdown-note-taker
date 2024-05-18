import { marked } from 'marked';

// Configure marked for standard Markdown with GitHub Flavored Markdown support
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Converts a raw Markdown string into an HTML string.
 *
 * This is a pure function that can be called from anywhere in the app.
 * It supports standard Markdown syntax including headings, bold, italic,
 * lists, links, and code blocks via the `marked` library.
 *
 * @param markdown - The raw Markdown text to convert
 * @returns The corresponding HTML string
 */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  return marked.parse(markdown) as string;
}
