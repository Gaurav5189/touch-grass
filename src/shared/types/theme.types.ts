export interface ThemeMode {
  mode: 'light' | 'dark' | 'auto';
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
}

export type ThemeAction = { type: 'SET_MODE'; payload: 'light' | 'dark' | 'auto' };
