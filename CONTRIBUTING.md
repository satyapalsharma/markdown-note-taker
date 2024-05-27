# Contributing

Thank you for your interest in contributing to this project! Please take a moment to review these guidelines.

---

## Development Setup

1. **Fork and clone** the repository.
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. **Copy the example environment file** (if applicable):
   ```bash
   cp .env.example .env
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

All new features and bug fixes **must** include passing tests.

---

## Code Style

- This project uses **TypeScript** and **ESLint** for static analysis.
- Follow the existing code style; do not introduce new linting rules without discussion.
- Use **descriptive variable and function names**; avoid abbreviations.
- Write **meaningful commit messages** following [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Keep functions small and focused; extract reusable logic into `src/lib/`.
- Prefer **composition over inheritance**.
- Run `npm run lint` before submitting a pull request.

---

## Pull Request Guidelines

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. **Make your changes** and ensure all tests pass.
3. **Update documentation** (README, inline comments, etc.) as needed.
4. **Open a pull request** against `main` with a clear description of:
   - What the change does.
   - Why it is needed.
   - Any breaking changes or migration steps.
5. **Address review feedback** promptly and keep the PR focused on a single concern.
6. Once approved, a maintainer will **squash and merge**.

---

Thank you for contributing! 🎉
