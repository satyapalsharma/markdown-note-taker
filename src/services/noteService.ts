/**
 * Generates a unique identifier for new notes.
 * @returns A string combining a timestamp and a random suffix.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * In-memory collection of notes, hydrated from local storage on load.
 */
let notes: Note[] = storage.loadNotes();

/**
 * Persists the current in-memory notes to local storage.
 */
function persist(): void {
  storage.saveNotes(notes);
}

/**
 * Service object exposing note CRUD and filtering operations.
 *
 * All mutations are persisted to local storage and logged via the
 * application logger.
 */
export const noteService = {
  /**
   * Returns a shallow copy of all notes.
   * @returns Array of all notes.
   */
  getAll(): Note[] {
    return [...notes];
  },

  /**
   * Retrieves a single note by its identifier.
   * @param id - The unique ID of the note.
   * @returns The matching note, or `undefined` if not found.
   */
  getById(id: string): Note | undefined {
    return notes.find((n) => n.id === id);
  },

  /**
   * Creates a new note from the provided draft.
   * @param draft - The note draft data.
   * @returns The newly created note with system fields populated.
   */
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

  /**
   * Updates an existing note with partial draft data.
   * @param id - The ID of the note to update.
   * @param patch - Partial note fields to merge.
   * @returns The updated note.
   * @throws {Error} If no note with the given ID exists.
   */
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

  /**
   * Deletes a note by its identifier.
   * @param id - The ID of the note to delete.
   * @throws {Error} If no note with the given ID exists.
   */
  delete(id: string): void {
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) {
      throw new Error(`Note not found: ${id}`);
    }
    notes.splice(idx, 1);
    persist();
    logger.info("Note deleted", { id });
  },

  /**
   * Filters and sorts a list of notes according to the provided criteria.
   * @param notesToFilter - The notes to process.
   * @param filter - Search and sort configuration.
   * @returns A new array of filtered and sorted notes.
   */
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
