import SystemError from '../pages/SystemError';
import React, { Component,useState,useEffect } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // You can log the error to an error reporting service here.
  }

  render() {
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
