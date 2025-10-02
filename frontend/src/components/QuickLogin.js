import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/design-system.css';

const QuickLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      await login({ 
        email: 'demo@example.com', 
        password: 'password' 
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '3rem',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🚀 LearnNext
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          marginBottom: '2rem' 
        }}>
          Welcome to your next-generation learning platform!
        </p>

        <button
          onClick={handleQuickLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '2rem'
          }}
        >
          {loading ? '⏳ Logging in...' : '🚀 Enter Platform (Demo)'}
        </button>

        <div style={{
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--accent-success)',
          fontSize: '0.875rem',
          color: 'var(--accent-success)'
        }}>
          <strong>Demo Mode:</strong> Click the button above to explore the platform with AI-powered course recommendations based on your interests!
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;
