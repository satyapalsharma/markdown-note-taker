import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
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
  const [showPreview, setShowPreview] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

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

  // Live HTML conversion — recomputes on every content change
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

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
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
            className={`rounded-md px-3 py-1.5 text-sm ${
              showPreview ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </div>

      {/* Editor + Preview area */}
      <div
        className={`flex-1 overflow-hidden ${
          showPreview ? "flex flex-col md:flex-row" : "flex"
        }`}
      >
        {/* Markdown textarea */}
        <div className={showPreview ? "flex-1 overflow-hidden md:border-r md:border-gray-200" : "flex-1 overflow-hidden"}>
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write markdown here..."
            className="h-full w-full resize-none p-4 font-mono text-sm focus:outline-none"
          />
        </div>

        {/* Live preview pane */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <NotePreview html={html} />
          </div>
        )}
      </div>
    </div>
  );
}
