import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900">
      <main className="flex-1 pt-8 px-4 md:px-12 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
