import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

import Home from './pages/Home';
import EdgeDetection from './pages/EdgeDetection';
import Enhancement from './pages/Enhancement';
import Scanner from './pages/Scanner';
import History from './pages/History';

function App() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow-1 overflow-auto main-content p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edge" element={<EdgeDetection />} />
            <Route path="/enhance" element={<Enhancement />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)'
          },
          success: {
            iconTheme: { primary: 'var(--accent-cyan)', secondary: 'var(--bg-card)' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: 'var(--bg-card)' },
          }
        }} 
      />
    </div>
  );
}

export default App;
