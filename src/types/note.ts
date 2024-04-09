export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteDraft extends Omit<Note, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

export type NoteSortField = "createdAt" | "updatedAt" | "title";

export type NoteSortOrder = "asc" | "desc";

export interface NoteFilter {
  search?: string;
  sortField?: NoteSortField;
  sortOrder?: NoteSortOrder;
}

export interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  filter: NoteFilter;
  isLoading: boolean;
  error: string | null;
}

export type AppView = "list" | "editor";
