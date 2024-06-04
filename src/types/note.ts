/**
 * Represents a single note in the application.
 */
export interface Note {
  /** Unique identifier for the note. */
  id: string;
  /** Title of the note. */
  title: string;
  /** Markdown content of the note. */
  content: string;
  /** Unix timestamp (ms) when the note was created. */
  createdAt: number;
  /** Unix timestamp (ms) when the note was last updated. */
  updatedAt: number;
}

/**
 * Shape used when creating a new note.
 * Omits system-generated fields (`id`, `createdAt`, `updatedAt`).
 */
export interface NoteDraft extends Omit<Note, "id" | "createdAt" | "updatedAt"> {
  /** Optional identifier for updates. */
  id?: string;
}

/**
 * Field by which notes can be sorted.
 */
export type NoteSortField = "createdAt" | "updatedAt" | "title";

/**
 * Sort direction.
 */
export type NoteSortOrder = "asc" | "desc";

/**
 * Filter criteria applied to a list of notes.
 */
export interface NoteFilter {
  /** Optional full-text search query. */
  search?: string;
  /** Field to sort by. */
  sortField?: NoteSortField;
  /** Sort direction. */
  sortOrder?: NoteSortOrder;
}

/**
 * Global application state for notes.
 */
export interface NoteState {
  /** All loaded notes. */
  notes: Note[];
  /** ID of the currently active note, if any. */
  activeNoteId: string | null;
  /** Current filter and sort configuration. */
  filter: NoteFilter;
  /** Whether a data fetch is in progress. */
  isLoading: boolean;
  /** Error message from the last operation, if any. */
  error: string | null;
}

/**
 * High-level view of the application UI.
 */
export type AppView = "list" | "editor";
