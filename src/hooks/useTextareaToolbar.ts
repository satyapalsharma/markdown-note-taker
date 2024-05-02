import { useRef, useState, useCallback } from "react";

export type ToolbarAction = "bold" | "italic" | "h1" | "h2";

interface UseTextareaToolbarOptions {
  content: string;
  onChange: (value: string) => void;
}

interface UseTextareaToolbarReturn {
  isFocused: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  applyAction: (action: ToolbarAction) => void;
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string,
  newContent: string
): void {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = newContent.slice(start, end);

  const textToInsert = selectedText
    ? `${before}${selectedText}${after}`
    : `${before}${placeholder}${after}`;

  const updated = newContent.slice(0, start) + textToInsert + newContent.slice(end);

  textarea.value = updated;

  // Place cursor inside the inserted text
  const cursorOffset = start + before.length + (selectedText ? selectedText.length : placeholder.length);
  textarea.setSelectionRange(cursorOffset, cursorOffset);

  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function prependAtCursor(
  textarea: HTMLTextAreaElement,
  prefix: string,
  newContent: string
): void {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const updated = newContent.slice(0, start) + prefix + newContent.slice(end);

  textarea.value = updated;

  const newCursorPos = start + prefix.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);

  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

export function useTextareaToolbar({
  content,
  onChange,
}: UseTextareaToolbarOptions): UseTextareaToolbarReturn {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const applyAction = useCallback(
    (action: ToolbarAction) => {
      const textarea = textareaRef.current;
      if (!textarea || !isFocused) return;

      textarea.focus();

      switch (action) {
        case "bold":
          insertAtCursor(textarea, "**", "**", "bold text", content);
          break;
        case "italic":
          insertAtCursor(textarea, "*", "*", "italic text", content);
          break;
        case "h1":
          prependAtCursor(textarea, "# ", content);
          break;
        case "h2":
          prependAtCursor(textarea, "## ", content);
          break;
        default:
          break;
      }

      // Sync the updated value back to React state
      onChange(textarea.value);
    },
    [content, onChange, isFocused]
  );

  return {
    isFocused,
    handleFocus,
    handleBlur,
    textareaRef,
    applyAction,
  };
}
