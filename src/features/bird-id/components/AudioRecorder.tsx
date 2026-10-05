import { Mic } from 'lucide-react';

export interface AudioRecorderProps {
  isRecording?: boolean;
  onStart?: () => void;
  onStop?: () => void;
}

export function AudioRecorder({ isRecording, onStart, onStop }: AudioRecorderProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <Mic className={`w-10 h-10 ${isRecording ? 'text-red-500 animate-pulse' : 'text-[var(--primary)]'}`} aria-hidden="true" />
        <p className="text-sm text-[var(--text-muted)]">Press to record 3s of bird call</p>
        <button
          onClick={isRecording ? onStop : onStart}
          disabled={isRecording}
          className="px-6 py-3 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary)]/90 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label="Record bird call"
        >
          {isRecording ? 'Recording...' : 'Record'}
        </button>
      </div>
    </div>
  );
}
