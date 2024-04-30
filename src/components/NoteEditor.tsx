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
  const [showPreview, setShowPreview] = useState(false);
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
      {/* Title Section */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <label htmlFor="note-title" className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter note title..."
          className="w-full text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 border-b border-gray-100 bg-gray-50 px-6 py-2">
        {isDirty && (
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        )}
        <button
          onClick={() => setShowPreview((p) => !p)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            showPreview
              ? "bg-gray-200 text-gray-800"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden bg-white">
        {showPreview ? (
          <div className="h-full overflow-y-auto p-6">
            <NotePreview html={html} />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <label htmlFor="note-content" className="sr-only">
              Note Content
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your note content here..."
              className="h-full w-full flex-1 resize-none p-6 font-mono text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            />
          </div>
        )}
      </div>
    </div>
  );
}
