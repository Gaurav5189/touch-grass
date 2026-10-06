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
          className={`px-6 py-3 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white'
          }`}
          aria-label={isRecording ? 'Stop recording bird call' : 'Record bird call'}
        >
          {isRecording ? 'Stop Recording' : 'Record'}
        </button>
      </div>
    </div>
  );
}
