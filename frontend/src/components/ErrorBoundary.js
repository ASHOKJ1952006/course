import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-error)',
          borderRadius: 'var(--radius-lg)',
          margin: '2rem'
        }}>
          <h2 style={{ color: 'var(--accent-error)', marginBottom: '1rem' }}>
            🚨 Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            There was an error rendering this component. Please refresh the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--gradient-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
                fontSize: '0.875rem',
                color: 'var(--text-primary)'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
