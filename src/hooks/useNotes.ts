import { useCallback, useEffect, useState } from "react";
import type { Note, NoteDraft, NoteFilter } from "../types/note";
import { noteService } from "../services/noteService";
import { logger } from "../lib/logger";

export function useNotes(initialFilter?: NoteFilter) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<NoteFilter>(initialFilter ?? {});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      setError(null);
      const all = noteService.getAll();
      const filtered = noteService.filter(all, filter);
      setNotes(filtered);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      logger.error("useNotes refresh failed", err);
    }
  }, [filter]);

  const loadInitial = useCallback(() => {
    setIsLoading(true);
    refresh();
    setIsLoading(false);
  }, [refresh]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const createNote = useCallback((draft: NoteDraft): Note => {
    const note = noteService.create(draft);
    refresh();
    return note;
  }, [refresh]);

  const updateNote = useCallback((id: string, patch: Partial<NoteDraft>): Note => {
    const note = noteService.update(id, patch);
    refresh();
    return note;
  }, [refresh]);

  const deleteNote = useCallback((id: string): void => {
    noteService.delete(id);
    refresh();
  }, [refresh]);

  const setSearch = useCallback((search: string) => {
    setFilter((prev) => ({ ...prev, search }));
  }, []);

  const setSort = useCallback(
    (sortField: NoteFilter["sortField"], sortOrder: NoteFilter["sortOrder"]) => {
      setFilter((prev) => ({ ...prev, sortField, sortOrder }));
    },
    []
  );

  return {
    notes,
    filter,
    isLoading,
    error,
    refresh,
    createNote,
    updateNote,
    deleteNote,
    setSearch,
    setSort,
  };
}
