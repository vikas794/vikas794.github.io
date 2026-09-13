import { Component, type ReactNode, type ErrorInfo as ReactErrorInfo } from "react";
import ErrorPage from "./doc/ErrorPage";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ReactErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorPage
          code="500"
          eyebrow="Error 500 · Application Error"
          title="Something went wrong."
          message="An unexpected error occurred while rendering this page. You can try refreshing or heading back to the home page."
          detail={this.state.error?.message}
        />
      );
    }

    return this.props.children;
  }
}
