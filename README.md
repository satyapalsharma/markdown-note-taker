# Markdown Note Taker

A minimalist, browser-based note-taking application built with React and TypeScript. Write notes in Markdown and see a live rendered preview side-by-side. All data is persisted locally in your browser via `localStorage`.

## Features

- **Markdown Live Preview** — Write in Markdown and see the rendered HTML update in real time.
- **Full Note CRUD** — Create, read, update, and delete notes with automatic persistence.
- **Search & Sort** — Quickly find notes by searching titles and content; sort by creation date, update date, or title.
- **Text Formatting Toolbar** — One-click insertion of bold, italic, H1, and H2 formatting at the cursor position.
- **Debounced Auto-Save** — Edits are saved automatically after a short delay so you never lose work.
- **Relative Timestamps** — Notes display human-readable relative times (e.g., "2 minutes ago").
- **Responsive Layout** — Clean, focused interface that works well on desktop and tablet viewports.
- **Client-Side Routing** — Navigate between the note list and individual note editors with React Router.
- **Typed Throughout** — Full TypeScript coverage with shared interfaces for notes, filters, and application state.

## Project Structure

```
markdown-note-taker/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component — mounts the router
│   ├── router/
│   │   └── index.tsx            # Route definitions (/, /note/:noteId)
│   ├── types/
│   │   ├── index.ts
│   │   └── note.ts              # Note, NoteDraft, NoteFilter, AppView types
│   ├── lib/
│   │   ├── index.ts
│   │   ├── markdown.ts          # Markdown → HTML conversion (marked)
│   │   ├── storage.ts           # localStorage read/write helpers
│   │   ├── time.ts              # Relative time formatting
│   │   ├── logger.ts            # Structured logging utility
│   │   └── errors.ts            # Custom error classes
│   ├── services/
│   │   └── noteService.ts       # In-memory note store with CRUD + filter/sort
│   ├── hooks/
│   │   ├── useNotes.ts          # React hook wrapping noteService with state
│   │   └── useTextareaToolbar.ts # Toolbar action insertion logic
│   ├── components/
│   │   ├── Layout.tsx           # Shared page layout shell
│   │   ├── NoteList.tsx         # Searchable, sortable list of notes
│   │   ├── NoteListItem.tsx     # Individual note row in the list
│   │   ├── NoteEditor.tsx       # Title + content editor with live preview
│   │   └── NotePreview.tsx      # Rendered Markdown preview pane
│   └── pages/
│       ├── HomePage.tsx         # Landing page — list + editor
│       └── NotePage.tsx         # Dedicated note editing page
└── ...
```

## Installation

### Prerequisites

- Node.js >= 18
- npm >= 9 (or your preferred package manager)

### Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview

# Run the linter
npm run lint
```

## Usage

### Creating a Note

1. Click **New Note** (or start typing in the editor on the home page).
2. Enter a title and write Markdown in the content area.
3. The preview pane updates automatically as you type.

### Formatting Text

Use the toolbar buttons above the editor to insert formatting at your cursor:

| Button | Effect |
|--------|--------|
| **B** | Wraps selection in `**bold**` |
| *I* | Wraps selection in `*italic*` |
| H1 | Prepends `# ` to the line |
| H2 | Prepends `## ` to the line |

You can also write Markdown directly — the preview supports headings, lists, links, code blocks, and more.

### Searching & Sorting

- Use the search box in the note list to filter by title or content.
- Click the **Created**, **Updated**, or **Title** column headers to sort ascending; click again to sort descending.

### Navigating

- Click any note in the list to open it in the dedicated editor view (`/note/:noteId`).
- Use the browser back button or the list view to return to the overview.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| Markdown | marked |
| State | React hooks (useState, useMemo, useCallback, useRef) |
| Persistence | localStorage |
| Linting | Oxlint |

## Data & Privacy

All notes are stored exclusively in your browser's `localStorage`. No data is sent to any server. Clearing your browser data will remove all notes.

## License

MIT — see [LICENSE](LICENSE) for details.
