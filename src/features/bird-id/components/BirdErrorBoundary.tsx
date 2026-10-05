import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class BirdErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): State {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Bird feature error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900" role="alert">
          <h3 className="font-bold">Something went wrong</h3>
          <p className="text-sm mt-1">The bird identification feature encountered an error. Try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
