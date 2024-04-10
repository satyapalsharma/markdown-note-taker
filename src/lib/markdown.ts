const HEADING_RE = /^(#{1,6})\s+(.+)$/gm;
const BOLD_RE = /\*\*(.+?)\*\*/g;
const ITALIC_RE = /\*(.+?)\*/g;
const CODE_RE = /`([^`]+)`/g;
const CODE_BLOCK_RE = /```([\s\S]*?)```/g;
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const LIST_ITEM_RE = /^\s*[-*+]\s+(.+)$/gm;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Code blocks (preserve content, wrap in <pre><code>)
  html = html.replace(CODE_BLOCK_RE, (_match, code) => {
    const escaped = escapeHtml(code.trim());
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Inline code
  html = html.replace(CODE_RE, "<code>$1</code>");

  // Links
  html = html.replace(LINK_RE, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Bold
  html = html.replace(BOLD_RE, "<strong>$1</strong>");

  // Italic
  html = html.replace(ITALIC_RE, "<em>$1</em>");

  // Headings
  html = html.replace(HEADING_RE, (_match, hashes, text) => {
    const level = hashes.length;
    return `<h${level}>${text}</h${level}>`;
  });

  // List items
  html = html.replace(LIST_ITEM_RE, "<li>$1</li>");

  // Paragraphs: wrap loose lines in <p>
  const lines = html.split("\n");
  const wrapped: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inList) {
        wrapped.push("</ul>");
        inList = false;
      }
      wrapped.push("");
      continue;
    }
    if (line.startsWith("<li>")) {
      if (!inList) {
        wrapped.push("<ul>");
        inList = true;
      }
      wrapped.push(line);
      continue;
    }
    if (inList) {
      wrapped.push("</ul>");
      inList = false;
    }
    if (!line.startsWith("<")) {
      wrapped.push(`<p>${line}</p>`);
    } else {
      wrapped.push(line);
    }
  }
  if (inList) wrapped.push("</ul>");

  return wrapped.join("\n");
}
