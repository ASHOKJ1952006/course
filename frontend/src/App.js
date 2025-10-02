import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProfessionalNextGenApp from './components/ProfessionalNextGenApp';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import './styles/professional-ui.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* Professional Learning Platform */}
        <ErrorBoundary>
          <ProfessionalNextGenApp />
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
}

export default App;