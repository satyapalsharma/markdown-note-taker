import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note, NoteDraft } from "../types/note";
import NotePreview from "../components/NotePreview";
import { parseMarkdownToHtml } from "../lib/markdown";
import { logger } from "../lib/logger";

export default function NoteEditor({
  activeNoteId,
  notes,
  createNote,
  updateNote,
}: {
  activeNoteId?: string;
  notes: Note[];
  createNote: (draft: NoteDraft) => Note;
  updateNote: (id: string, patch: Partial<NoteDraft>) => Note;
}) {
  const { noteId: routeNoteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();

  const noteId = activeNoteId ?? routeNoteId ?? null;

  const note = useMemo(() => notes.find((n) => n.id === noteId) ?? null, [notes, noteId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const createdNoteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsDirty(false);
      createdNoteIdRef.current = note.id;
    } else {
      setTitle("");
      setContent("");
      setIsDirty(false);
      createdNoteIdRef.current = null;
    }
  }, [note?.id]);

  const saveNote = useCallback(
    (newTitle: string, newContent: string) => {
      if (!noteId && !createdNoteIdRef.current) {
        const created = createNote({ title: newTitle, content: newContent });
        createdNoteIdRef.current = created.id;
        navigate(`/note/${created.id}`);
        logger.info("Note created from auto-save", { id: created.id });
      } else if (noteId || createdNoteIdRef.current) {
        const id = noteId ?? createdNoteIdRef.current;
        updateNote(id, { title: newTitle, content: newContent });
        logger.info("Note updated from auto-save", { id });
      }
    },
    [noteId, createNote, updateNote, navigate]
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setIsDirty(true);
    saveNote(value, content);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsDirty(true);
    saveNote(title, value);
  };

  const handleSave = () => {
    if (!noteId && !createdNoteIdRef.current) {
      const created = createNote({ title, content });
      createdNoteIdRef.current = created.id;
      navigate(`/note/${created.id}`);
      logger.info("Note created from manual save", { id: created.id });
    } else if (noteId || createdNoteIdRef.current) {
      const id = noteId ?? createdNoteIdRef.current;
      updateNote(id, { title, content });
      logger.info("Note updated from manual save", { id });
    }
    setIsDirty(false);
  };

  const handleBlur = () => {
    if (isDirty) {
      handleSave();
    }
  };

  const html = useMemo(() => parseMarkdownToHtml(content), [content]);

  if (!noteId && !createdNoteIdRef.current) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <p className="text-gray-500">Select a note or create a new one</p>
        <button
          onClick={() => {
            const created = createNote({ title: "", content: "" });
            createdNoteIdRef.current = created.id;
            navigate(`/note/${created.id}`);
          }}
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
          onBlur={handleBlur}
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
            onBlur={handleBlur}
            placeholder="Write markdown here..."
            className="h-full w-full resize-none p-4 font-mono text-sm focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
