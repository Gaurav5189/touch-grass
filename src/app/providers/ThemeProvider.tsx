import { createContext, useContext, useEffect, useReducer, ReactNode, useCallback } from 'react';
import { ThemeState, ThemeAction, ThemeMode } from '../../shared/types/theme.types';

const THEME_KEY = 'touch-grass-theme';

function getInitialTheme(): ThemeState {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ThemeMode;
      if (parsed.mode === 'light' || parsed.mode === 'dark' || parsed.mode === 'auto') {
        return { mode: parsed.mode };
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { mode: 'auto' };
}

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_MODE':
      return { mode: action.payload };
    default:
      return state;
  }
}

function resolveThemeClass(mode: ThemeState['mode']): string {
  if (mode === 'auto') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

interface ThemeContextValue {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeState['mode']) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, getInitialTheme());

  const resolved = resolveThemeClass(state.mode) as 'light' | 'dark';

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify({ mode: state.mode }));
    } catch {
      // Ignore storage errors
    }
  }, [state.mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'auto');
    if (state.mode === 'auto') {
      root.classList.add('auto');
    } else {
      root.classList.add(state.mode);
    }
  }, [state.mode, resolved]);

  const setMode = useCallback((mode: ThemeState['mode']) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  return (
    <ThemeContext.Provider value={{ state, dispatch, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
