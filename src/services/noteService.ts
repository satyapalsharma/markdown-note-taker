import { Note, NoteDraft, NoteFilter } from "../types/note";
import { storage } from "../lib/storage";
import { logger } from "../lib/logger";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

let notes: Note[] = storage.loadNotes();

function persist(): void {
  storage.saveNotes(notes);
}

export const noteService = {
  getAll(): Note[] {
    return [...notes];
  },

  getById(id: string): Note | undefined {
    return notes.find((n) => n.id === id);
  },

  create(draft: NoteDraft): Note {
    const now = Date.now();
    const note: Note = {
      id: generateId(),
      title: draft.title || "Untitled Note",
      content: draft.content || "",
      createdAt: now,
      updatedAt: now,
    };
    notes = [note, ...notes];
    persist();
    logger.info("Note created", { id: note.id });
    return note;
  },

  update(id: string, patch: Partial<NoteDraft>): Note {
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      throw new Error(`Note not found: ${id}`);
    }
    const updated: Note = {
      ...notes[idx],
      ...patch,
      id: notes[idx].id,
      createdAt: notes[idx].createdAt,
      updatedAt: Date.now(),
    };
    notes[idx] = updated;
    persist();
    logger.info("Note updated", { id });
    return updated;
  },

  delete(id: string): void {
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      throw new Error(`Note not found: ${id}`);
    }
    notes.splice(idx, 1);
    persist();
    logger.info("Note deleted", { id });
  },

  filter(notesToFilter: Note[], filter: NoteFilter): Note[] {
    let result = [...notesToFilter];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    const sortField = filter.sortField ?? "updatedAt";
    const sortOrder = filter.sortOrder ?? "desc";

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  },
};
