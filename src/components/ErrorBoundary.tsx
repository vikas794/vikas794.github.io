import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorPage from "./doc/ErrorPage";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Catches render-time crashes anywhere under <Outlet> and swaps them for a
// 500-flavored version of ErrorPage instead of a blank white screen. Static
// hosting has no server to emit a real 5xx, so this is the closest
// equivalent: a client-side "something broke" page with the same shape.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorPage
          code="500"
          eyebrow="Error 500 · Something broke"
          title="Something went wrong."
          message="This page hit an unexpected error. Try reloading, or head back to the home page — if it keeps happening, let me know."
          detail={this.state.error.message}
        />
      );
    }
    return this.props.children;
  }
}
