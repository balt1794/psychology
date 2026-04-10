/**
 * Strips common Markdown so pasted listing copy is plain text (no ###, **, etc.).
 */
export function stripMarkdownPlain(text: string): string {
  let s = text.replace(/\r\n/g, "\n");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*\n]+)\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/_([^_\n]+)_/g, "$1");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}
