import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import { useTextareaToolbar, ToolbarAction } from "../hooks/useTextareaToolbar";
import NotePreview from "../components/NotePreview";
import { parseMarkdownToHtml } from "../lib/markdown";
import { logger } from "../lib/logger";

export default function NoteEditor({ activeNoteId }: { activeNoteId?: string }) {
  const { noteId: routeNoteId } = useParams<{ noteId: string }>();
  const { notes, createNote, updateNote } = useNotes();

  const noteId = activeNoteId ?? routeNoteId ?? null;

  const note = useMemo(() => notes.find((n) => n.id === noteId) ?? null, [notes, noteId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { isFocused, handleFocus, handleBlur, textareaRef, applyAction } = useTextareaToolbar({
    content,
    onChange: setContent,
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsDirty(false);
    } else {
      setTitle("");
      setContent("");
      setIsDirty(false);
    }
  }, [note?.id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setIsDirty(true);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!noteId) {
      const created = createNote({ title, content });
      logger.info("Note created from editor", { id: created.id });
    } else {
      updateNote(noteId, { title, content });
      logger.info("Note updated from editor", { id: noteId });
    }
    setIsDirty(false);
  };

  const html = useMemo(() => parseMarkdownToHtml(content), [content]);

  if (!noteId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <p className="text-gray-500">Select a note or create a new one</p>
        <button
          onClick={() => createNote({ title: "", content: "" })}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Note
        </button>
      </div>
    );
  }

  const toolbarButtons: { action: ToolbarAction; label: string; title: string }[] = [
    { action: "bold", label: "B", title: "Bold" },
    { action: "italic", label: "I", title: "Italic" },
    { action: "h1", label: "H1", title: "Heading 1" },
    { action: "h2", label: "H2", title: "Heading 2" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title"
          className="flex-1 text-lg font-medium focus:outline-none"
        />
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleSave}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              Save
            </button>
          )}
          <button
            onClick={() => setShowPreview((p) => !p)}
            className={`rounded-md px-3 py-1.5 text-sm ${showPreview ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {!showPreview && (
        <div className="flex items-center gap-1 border-b border-gray-100 bg-gray-50 px-4 py-1.5">
          {toolbarButtons.map(({ action, label, title }) => (
            <button
              key={action}
              type="button"
              title={title}
              disabled={!isFocused}
              onClick={() => applyAction(action)}
              className={`rounded px-2 py-1 text-xs font-semibold transition-colors ${
                isFocused
                  ? "text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <div className="h-full overflow-y-auto p-4">
            <NotePreview html={html} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Write markdown here..."
            className="h-full w-full resize-none p-4 font-mono text-sm focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
