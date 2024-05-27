# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-01-01

### Added

- Initial project scaffold with **React 18** and **TypeScript**.
- **Note management**: create, edit, and delete notes with local storage persistence.
- **Markdown rendering** support for note content.
- **Responsive layout** with a sidebar note list and main editor area.
- **Auto-save** with debounced writes to prevent data loss.
- **Search / filter** functionality across all notes.
- **Keyboard shortcuts** for common actions (new note, save, delete).
- **Error boundary** and global error handling for uncaught exceptions and unhandled promise rejections.
- **Structured logging** utility (`src/lib/logger.ts`) for debug and production environments.
- **Custom hooks** (`useNotes`, `useTextareaToolbar`) for reusable component logic.
- **Routing** between the home list view and individual note pages.
- **CI/CD configuration** with automated testing and linting.
- **Documentation**: README, CONTRIBUTING, SECURITY, and CHANGELOG files.

---

[1.0.0]: https://github.com/your-org/your-repo/releases/tag/v1.0.0
