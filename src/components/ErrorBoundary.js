import React from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught:', error, errorInfo);
        // You can log errors to an error reporting service here
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
                        <p className="text-gray-700 mb-6">
                            {this.state.error?.message || 'Something went wrong'}
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Reload Application
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;