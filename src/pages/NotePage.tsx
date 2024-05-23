import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import NoteEditor from "../components/NoteEditor";
import NoteList from "../components/NoteList";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, setSearch, setSort, filter } = useNotes();

  const activeNote = useMemo(() => notes.find((n) => n.id === noteId), [notes, noteId]);

  const handleCreateNote = (draft: { title: string; content: string }) => {
    const note = createNote(draft);
    navigate(`/note/${note.id}`);
  };

  const handleNoteSelect = (id: string) => {
    navigate(`/note/${id}`);
  };

  if (!activeNote) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Note not found. <button onClick={() => navigate("/")} className="ml-2 text-blue-600 underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <NoteList
        notes={notes}
        onCreateNote={handleCreateNote}
        onSearch={setSearch}
        onSort={setSort}
        sortField={filter.sortField}
        sortOrder={filter.sortOrder}
        search={filter.search}
        activeNoteId={noteId}
        onNoteSelect={handleNoteSelect}
      />
      <div className="flex-1 overflow-hidden">
        <NoteEditor
          activeNoteId={activeNote.id}
          notes={notes}
          createNote={createNote}
          updateNote={updateNote}
        />
      </div>
    </div>
  );
}
