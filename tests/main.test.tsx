import { describe, it, expect, beforeAll } from 'vitest';

// main.tsx is side-effectful: on import it mounts the app into #root.
// Provide the container BEFORE importing so the module bootstrap succeeds,
// then give React a tick to flush the initial render.
describe('main', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('bootstraps the app and renders into #root', async () => {
    await expect(import('@/src/main')).resolves.toBeDefined();
    // createRoot().render() schedules asynchronously — flush microtasks + a
    // macrotask so the initial commit lands in the DOM.
    await new Promise((r) => setTimeout(r, 100));
    const root = document.getElementById('root');
    expect(root).not.toBeNull();
    expect(root!.childElementCount).toBeGreaterThan(0);
  });
});
