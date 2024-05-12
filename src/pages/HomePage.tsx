import { useMemo, useState } from "react";
import { useNotes } from "../hooks/useNotes";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import { AppView } from "../types/note";

export default function HomePage() {
  const { notes, isLoading, error, createNote, setSearch, setSort, filter } = useNotes();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const view = useMemo<AppView>(() => (notes.length > 0 ? AppView.editor : AppView.list), [notes.length]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  const handleCreateNote = (draft: { title: string; content: string }) => {
    const note = createNote(draft);
    setActiveNoteId(note.id);
  };

  const handleNoteSelect = (id: string) => {
    setActiveNoteId(id);
  };

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
        activeNoteId={activeNoteId}
        onNoteSelect={handleNoteSelect}
      />
      <div className="flex-1 overflow-hidden">
        {view === AppView.editor ? (
          <NoteEditor activeNoteId={activeNoteId ?? undefined} />
        ) : (
          <EmptyState onCreateNote={handleCreateNote} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onCreateNote }: { onCreateNote: (draft: { title: string; content: string }) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
      <p className="text-lg">No notes yet</p>
      <button
        onClick={() => onCreateNote({ title: "", content: "" })}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Create your first note
      </button>
    </div>
  );
}
