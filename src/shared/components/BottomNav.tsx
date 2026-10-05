import { Mic, Camera, History } from 'lucide-react';

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-around px-4 z-50"
      aria-label="Main navigation"
    >
      <a
        href="#bird"
        className="flex flex-col items-center gap-0.5 p-2 text-[var(--text-muted)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
        aria-label="Bird identification"
      >
        <Mic className="w-5 h-5" aria-hidden="true" />
        <span className="text-[10px] leading-none">Bird</span>
      </a>
      <a
        href="#photo"
        className="flex flex-col items-center gap-0.5 p-2 text-[var(--text-muted)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
        aria-label="Photo identification"
      >
        <Camera className="w-5 h-5" aria-hidden="true" />
        <span className="text-[10px] leading-none">Photo</span>
      </a>
      <a
        href="#history"
        className="flex flex-col items-center gap-0.5 p-2 text-[var(--text-muted)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg"
        aria-label="History"
      >
        <History className="w-5 h-5" aria-hidden="true" />
        <span className="text-[10px] leading-none">History</span>
      </a>
    </nav>
  );
}
