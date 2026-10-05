import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
        <Leaf className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text)]">Touch Grass</h1>
      </div>
    </header>
  );
}
