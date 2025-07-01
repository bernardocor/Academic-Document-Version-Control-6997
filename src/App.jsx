import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DocumentProvider } from './contexts/DocumentContext';
import AuthScreen from './components/auth/AuthScreen';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';

// Create demo user on first load
const createDemoUser = () => {
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const demoExists = existingUsers.find(user => user.email === 'demo@docversion.com');
  
  if (!demoExists) {
    const demoUser = {
      id: 'demo-user-id',
      name: 'Usuario Demo',
      email: 'demo@docversion.com',
      password: 'demo123',
      createdAt: new Date().toISOString(),
      profile: {
        institution: 'Universidad Demo',
        degree: 'doctorado',
        field: 'Ciencias de la Computación'
      }
    };
    
    existingUsers.push(demoUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  }
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <DocumentProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentList />} />
              <Route path="/document/:id" element={<DocumentDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DocumentProvider>
  );
};

function App() {
  useEffect(() => {
    // Create demo user on app initialization
    createDemoUser();
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;