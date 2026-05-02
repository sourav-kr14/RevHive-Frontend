import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#0d0d1f] text-white">
          <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              Something went wrong 🚨
            </h1>

            <p className="text-gray-400 mb-6">
              An unexpected error occurred. Please try again.
            </p>

            <button
              onClick={this.handleReload}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
