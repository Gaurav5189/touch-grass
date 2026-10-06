import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from '../../shared/components/BottomNav';

export interface LayoutProps {
  children: ReactNode;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function Layout({ children, activeTab, onSelectTab }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav activeTab={activeTab} onSelectTab={onSelectTab} />
    </div>
  );
}
