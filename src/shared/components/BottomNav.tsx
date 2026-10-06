import { Mic, Camera, History, Database } from 'lucide-react';

export interface BottomNavProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function BottomNav({ activeTab = 'bird', onSelectTab }: BottomNavProps) {
  const tabs = [
    { id: 'bird', label: 'Bird', icon: Mic, ariaLabel: 'Bird identification' },
    { id: 'photo', label: 'Photo', icon: Camera, ariaLabel: 'Photo identification' },
    { id: 'history', label: 'History', icon: History, ariaLabel: 'Observation history' },
    { id: 'models', label: 'Models', icon: Database, ariaLabel: 'Model manager' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] flex items-center justify-around px-2 z-40"
      aria-label="Main navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            onClick={() => onSelectTab?.(tab.id)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
              isActive
                ? 'text-[var(--primary)] font-semibold scale-105'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            aria-label={tab.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} aria-hidden="true" />
            <span className="text-[11px] leading-none">{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
