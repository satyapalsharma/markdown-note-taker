import type { Note } from "../types/note";
import { logger } from "./logger";

const STORAGE_KEY = "markdown-note-taker-notes";

function readNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    if (!Array.isArray(parsed)) {
      logger.warn("Storage parse: expected array, got something else");
      return [];
    }
    return parsed;
  } catch (err) {
    logger.error("Failed to read notes from localStorage", err);
    return [];
  }
}

function writeNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    logger.error("Failed to write notes to localStorage", err);
  }
}

export const storage = {
  loadNotes(): Note[] {
    return readNotesFromStorage();
  },
  saveNotes(notes: Note[]): void {
    writeNotesToStorage(notes);
  },
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      logger.error("Failed to clear localStorage", err);
    }
  },
};
