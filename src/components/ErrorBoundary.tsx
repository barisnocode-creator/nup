import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bir şeyler ters gitti
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Beklenmedik bir hata oluştu. Sayfayı yenileyerek tekrar deneyin.
          </p>
          {this.state.error && (
            <p className="text-xs text-muted-foreground mb-6 font-mono bg-muted px-3 py-2 rounded max-w-md break-all">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
