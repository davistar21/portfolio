"use client";

import React from "react";
import { AlertCircle, RotateCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `Section error${this.props.name ? ` (${this.props.name})` : ""}:`,
      error,
      info,
    );
  }

  private retry = () => {
    // Hard reload — server components rendered with the failed fetch are baked
    // into the streamed HTML, so the only reliable way to re-run them is to
    // reload. Cheap and predictable.
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 text-center">
        <AlertCircle className="w-7 h-7 text-destructive/70" />
        <div>
          <p className="font-semibold text-sm">
            Couldn&apos;t load {this.props.name ?? "this section"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            The rest of the page is fine.
          </p>
        </div>
        <button
          onClick={this.retry}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full border bg-background hover:bg-muted transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Try again
        </button>
      </div>
    );
  }
}
