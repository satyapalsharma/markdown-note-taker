import { useMemo, useState } from "react";
import { Note, NoteSortField, NoteSortOrder } from "../types/note";

interface NoteListProps {
  notes: Note[];
  onCreateNote: (draft: { title: string; content: string }) => void;
  onSearch: (search: string) => void;
  onSort: (field: NoteSortField, order: NoteSortOrder) => void;
  sortField?: NoteSortField;
  sortOrder?: NoteSortOrder;
  search?: string;
}

export default function NoteList({
  notes,
  onCreateNote,
  onSearch,
  onSort,
  sortField = "updatedAt",
  sortOrder = "desc",
  search = "",
}: NoteListProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearch(value);
  };

  const toggleSort = (field: NoteSortField) => {
    if (sortField === field) {
      onSort(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "desc");
    }
  };

  const sortLabel = useMemo(() => {
    const arrow = sortOrder === "asc" ? "↑" : "↓";
    return `${sortField} ${arrow}`;
  }, [sortField, sortOrder]);

  return (
    <aside className="flex w-72 flex-col border-r border-gray-200 bg-white">
      <div className="p-3">
        <button
          onClick={() => onCreateNote({ title: "", content: "" })}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Note
        </button>
      </div>

      <div className="px-3 pb-2">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between px-3 pb-2 text-xs text-gray-500">
        <span>{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => toggleSort("updatedAt")}
          className="rounded px-2 py-1 hover:bg-gray-100"
          title="Sort by updated"
        >
          {sortField === "updatedAt" ? sortLabel : "Sort"}
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-2 pb-2">
        {notes.map((note) => (
          <li key={note.id}>
            <NoteListItem note={note} />
          </li>
        ))}
        {notes.length === 0 && (
          <li className="px-2 py-4 text-center text-sm text-gray-400">No notes found</li>
        )}
      </ul>
    </aside>
  );
}

function NoteListItem({ note }: { note: Note }) {
  const date = new Date(note.updatedAt).toLocaleDateString();
  const preview = note.content.slice(0, 60).replace(/\n/g, " ");

  return (
    <a
      href={`#/note/${note.id}`}
      className="block rounded-md px-3 py-2 hover:bg-gray-100"
    >
      <div className="truncate text-sm font-medium">{note.title || "Untitled"}</div>
      <div className="truncate text-xs text-gray-500">{preview || "No content"}</div>
      <div className="mt-1 text-xs text-gray-400">{date}</div>
    </a>
  );
}
