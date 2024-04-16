import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-50 text-gray-900">
      <header className="flex items-center border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-xl font-semibold tracking-tight">Markdown Note Taker</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
