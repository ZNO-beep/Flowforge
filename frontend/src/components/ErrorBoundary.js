import React from 'react';

/**
 * Error boundary component to catch rendering errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-destructive bg-destructive/10 rounded-md">
          <h3 className="text-lg font-medium text-destructive mb-2">Something went wrong</h3>
          <p className="text-sm text-destructive/80 mb-4">
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          <button 
            className="px-3 py-1 bg-background border rounded-md text-sm"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 