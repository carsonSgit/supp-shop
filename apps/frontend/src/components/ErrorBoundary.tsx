import SystemError from "../pages/SystemError";
import React, { Component, ReactNode } from "react";
import { ErrorBoundaryProps, ErrorBoundaryState } from "../shared/types/components.types";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true, error, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		this.setState({ error, errorInfo });
		// You can log the error to an error reporting service here.
	}

	render(): ReactNode {
		if (this.state.hasError) {
			// Render fallback UI
			return (
				<div>
					<SystemError errorMessage="Something went wrong." />
				</div>
			);
		}

		// Otherwise, render the children components as usual
		return this.props.children;
	}
}

export default ErrorBoundary;

