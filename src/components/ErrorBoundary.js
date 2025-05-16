import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-4">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150"
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <p className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                  {this.state.error && this.state.error.toString()}
                </p>
                <p className="text-sm font-mono text-gray-600 mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 