import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Note, NoteDraft } from "../types/note";
import NotePreview from "../components/NotePreview";
import { parseMarkdownToHtml } from "../lib/markdown";
import { logger } from "../lib/logger";

const DEBOUNCE_MS = 500;

interface NoteEditorProps {
  activeNoteId?: string;
  notes?: Note[];
  createNote?: (draft: NoteDraft) => Note;
  updateNote?: (id: string, patch: Partial<NoteDraft>) => Note;
}

export default function NoteEditor({
  activeNoteId,
  notes: notesProp,
  createNote: createNoteProp,
  updateNote: updateNoteProp,
}: NoteEditorProps) {
  const { noteId: routeNoteId } = useParams<{ noteId: string }>();
  const { notes: hookNotes, createNote: hookCreateNote, updateNote: hookUpdateNote } = useNotes();

  const notes = notesProp ?? hookNotes;
  const createNote = createNoteProp ?? hookCreateNote;
  const updateNote = updateNoteProp ?? hookUpdateNote;

  const noteId = activeNoteId ?? routeNoteId ?? null;

  const note = useMemo(() => notes.find((n) => n.id === noteId) ?? null, [notes, noteId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending debounced save when switching notes
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

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

  const scheduleSave = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      handleSave();
      debounceTimerRef.current = null;
    }, DEBOUNCE_MS);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setIsDirty(true);
    scheduleSave();
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
    scheduleSave();
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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

      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <div className="h-full overflow-y-auto p-4">
            <NotePreview html={html} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write markdown here..."
            className="h-full w-full resize-none p-4 font-mono text-sm focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
